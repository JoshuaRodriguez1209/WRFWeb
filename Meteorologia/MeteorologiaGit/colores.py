from PIL import Image
import matplotlib.pyplot as plt
def graficar_recta_colores(colores_hex, valores=None, titulo="Recta de colores"):
    n = len(colores_hex)
    fig, ax = plt.subplots(figsize=(16, 2))
    
    for i, color in enumerate(colores_hex):
        ax.add_patch(plt.Rectangle((i, 0), 1, 1, color=color))
        if valores and i % max(1, n // 20) == 0:
            ax.text(i + 0.5, -0.3, str(valores[i]), ha='center', va='top', fontsize=8)

    ax.set_xlim(0, n)
    ax.set_ylim(-0.5, 1)
    ax.axis('off')
    plt.title(titulo)
    plt.tight_layout()
    plt.show()
# Cargar la imagen
img = Image.open("./images/bar_PM10.png").convert("RGB")

# Usamos la fila central de la imagen
y = img.height // 4

# Extraer colores pixel por pixel de esa fila
colors = []
for x in range(img.width):
    r, g, b = img.getpixel((x, y))
    hex_color = "#{:02x}{:02x}{:02x}".format(r, g, b)
    if not colors or colors[-1] != hex_color: # Evita repeticiones consecutivas
        colors.append(hex_color)

# Mostrar resultado
print("Colores únicos en la recta horizontal:")
for i, color in enumerate(colors):
    print(f"{color}")

graficar_recta_colores(colors)