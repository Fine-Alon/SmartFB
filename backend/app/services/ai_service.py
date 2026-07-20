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
        "Analyze the provided text and strictly assign it to ONE of these categories: "
        "[Bug, Billing, Service Complaint, General Feedback, Pricing, Other]. "
        "Provide a concise one-sentence summary of the user's issue. "
        "Fix any spelling or grammatical errors in the user's original text and provide the corrected version. "
        "Evaluate if the message requires urgent human intervention due to: "
        "abusive language, threats, extreme anger, or high-risk business complaints. "
        "\n\n"
        "CRITICAL: You must return your response strictly as a raw JSON object. "
        "Match this exact schema:\n"
        "{\n"
        '  "category": "string",\n'
        '  "summary": "string",\n'
        '  "corrected_text": "string",\n'
        '  "is_flagged": boolean,\n'
        '  "flag_reason": "string or null"\n'
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