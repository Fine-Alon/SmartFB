import json
import os
from ollama import AsyncClient
from fastapi import HTTPException, status

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

async def analyze_submission_text(text_content: str) -> dict:
    """
    שולח את טקסט הפנייה ל-Ollama ומנתח אותו בזמן אמת.
    מחזיר דיקשנרי מובנה עם סיווג, סיכום, ודגל אדום אם ההודעה מסוכנת/דחופה.
    """
    
    system_prompt = (
        "You are an advanced AI customer feedback triage system. "
        "Analyze the provided JSON submission (which may contain text answers, numerical ratings, or multiple-choice answers) "
        "and strictly assign it to ONE of these categories: "
        '["SAFE", "NEEDS_REVIEW", "URGENT"].\n\n'
        "Definitions:\n"
        "- SAFE: Positive feedback, general questions, generic suggestions, or neutral comments (e.g., ratings of 4 or 5).\n"
        "- NEEDS_REVIEW: Mild frustration, minor bugs, feature requests, or mediocre ratings (e.g., 3 out of 5).\n"
        "- URGENT: Cursing, anger, threats to leave (churn), legal threats, severe service failures, or very low numerical ratings (e.g., 1 or 2 out of 5) even if the free-text is empty.\n\n"
        "Provide a concise one-sentence summary of the user's issue.\n\n"
        "CRITICAL: Evaluate the entire submission JSON. If there are numerical ratings that are very low, OR if multiple-choice answers indicate severe dissatisfaction, immediately classify as URGENT or NEEDS_REVIEW even if the free-text field is empty. "
        "You must return your response strictly as a raw JSON object. "
        "Do not include any conversational filler or markdown formatting blocks. "
        "Match this exact schema:\n"
        "{\n"
        '  "category": "SAFE" | "NEEDS_REVIEW" | "URGENT",\n'
        '  "summary": "string"\n'
        "}"
    )

    try:
        response = await AsyncClient().generate(
            model=OLLAMA_MODEL,
            prompt=f"Text to analyze: {text_content}",
            system=system_prompt,
            format="json", 
            options={"temperature": 0.0} 
        )
        
        raw_output = response.get("response", "").strip()
        
        analysis_result = json.loads(raw_output)
        return analysis_result

    except json.JSONDecodeError:
        # הגנה למקרה נדיר שהמודל החזיר JSON שבור
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The AI returned an invalid JSON structure."
        )
    except Exception as e:
        # הגנה למקרה שתוכנת Ollama נסגרה או לא זמינה
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI Service (Ollama) is unavailable: {str(e)}"
        )