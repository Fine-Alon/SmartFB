import asyncio
from ollama import AsyncClient

async def test():
    print("שולח הודעה ל-Ollama, אנא המתן...")
    
    # הודעת בדיקה של לקוח עצבני
    customer_message = "השירות שלכם פשוט זוועה! אם אתם לא מחזירים לי את הכסף אני תובע אתכם!"
    
    system_instruction = (
        "You are an AI assistant. Analyze the text. "
        "Return ONLY a raw JSON with keys: 'category', 'is_urgent' (boolean)."
    )
    
    # פנייה למודל המקומי
    response = await AsyncClient().generate(
        model="llama3.2",
        prompt=customer_message,
        system=system_instruction,
        format="json"  # מבקש מאולמה להחזיר רק JSON
    )
    
    print("\n--- תשובת ה-AI שהתקבלה מהמחשב שלך: ---")
    print(response['response'])

# הרצת הטסט האסינכרוני
asyncio.run(test())