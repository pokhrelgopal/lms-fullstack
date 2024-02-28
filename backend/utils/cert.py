import os
import time
from PIL import Image, ImageDraw, ImageFont


def generate_certificate(
    student_name, instructor_signature, instructor_name, course_name
):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    certificate_path = os.path.join(base_dir, "utils", "certificate.png")
    font1_path = os.path.join(base_dir, "utils", "fonts", "norwester.otf")
    font2_path = os.path.join(base_dir, "utils", "fonts", "youngserif.otf")
    font3_path = os.path.join(base_dir, "utils", "fonts", "Signature.otf")

    img = Image.open(certificate_path)
    draw = ImageDraw.Draw(img)

    font1 = ImageFont.truetype(font1_path, 70)
    font2 = ImageFont.truetype(font2_path, 20)
    font3 = ImageFont.truetype(font3_path, 30)

    x_position = 408
    y_position = 390

    draw.text((x_position, y_position), student_name, fill="red", font=font1)
    draw.text((x_position, y_position + 160), course_name, fill="black", font=font2)
    draw.text(
        (x_position, y_position + 300), instructor_signature, fill="black", font=font3
    )
    draw.text((x_position, y_position + 385), instructor_name, fill="black", font=font2)

    filename = (
        base_dir
        + "/media/certificates/certificate_"
        + student_name
        + int(time.time()).__str__()
        + ".png"
    )
    img.save(filename)
    return filename
