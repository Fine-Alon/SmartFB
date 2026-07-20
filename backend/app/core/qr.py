import base64
import io
import qrcode
from qrcode.constants import ERROR_CORRECT_L


def generate_qr_code_base64(target_url: str) -> str:
    """Generates a QR code PNG for target_url and returns it as a Base64 data URI string."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=ERROR_CORRECT_L,  # Direct constant import satisfies type checkers
        box_size=10,
        border=4,
    )
    qr.add_data(target_url)
    qr.make(fit=True)

    # Create PNG image in memory
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    
    # Passing "PNG" as a positional string arg satisfies PIL/Pylance typing
    img.save(buffer, "PNG")

    # Encode to Base64
    base64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{base64_str}"