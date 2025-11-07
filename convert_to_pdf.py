#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para convertir README.md a PDF con imágenes incluidas
Requiere: pip install markdown WeasyPrint Pillow
"""

import markdown
import os
from pathlib import Path

def convert_markdown_to_html(md_file):
    """Convierte Markdown a HTML"""
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Configurar extensiones de markdown
    extensions = [
        'markdown.extensions.tables',
        'markdown.extensions.fenced_code',
        'markdown.extensions.codehilite',
        'markdown.extensions.toc',
        'markdown.extensions.nl2br'
    ]
    
    # Convertir markdown a HTML
    html_body = markdown.markdown(md_content, extensions=extensions)
    
    # Crear HTML completo con estilos
    html_template = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentación Proyecto WRF-Chem</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
        }}
        
        h1 {{
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-top: 30px;
            page-break-before: auto;
        }}
        
        h2 {{
            color: #34495e;
            border-bottom: 2px solid #3498db;
            padding-bottom: 8px;
            margin-top: 25px;
        }}
        
        h3 {{
            color: #555;
            margin-top: 20px;
        }}
        
        h4 {{
            color: #666;
            margin-top: 15px;
        }}
        
        img {{
            max-width: 100%;
            height: auto;
            display: block;
            margin: 20px auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px;
            page-break-inside: avoid;
        }}
        
        code {{
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }}
        
        pre {{
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #3498db;
            overflow-x: auto;
            page-break-inside: avoid;
        }}
        
        pre code {{
            background-color: transparent;
            padding: 0;
        }}
        
        ul, ol {{
            margin-left: 20px;
        }}
        
        li {{
            margin-bottom: 8px;
        }}
        
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            page-break-inside: avoid;
        }}
        
        table th, table td {{
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }}
        
        table th {{
            background-color: #3498db;
            color: white;
        }}
        
        table tr:nth-child(even) {{
            background-color: #f9f9f9;
        }}
        
        blockquote {{
            border-left: 4px solid #3498db;
            padding-left: 15px;
            margin-left: 0;
            color: #555;
            font-style: italic;
        }}
        
        hr {{
            border: none;
            border-top: 2px solid #3498db;
            margin: 30px 0;
        }}
        
        .figura {{
            text-align: center;
            font-style: italic;
            color: #666;
            margin-top: 10px;
            margin-bottom: 20px;
        }}
        
        /* Evitar saltos de página en lugares inapropiados */
        h1, h2, h3, h4, h5, h6 {{
            page-break-after: avoid;
        }}
        
        p {{
            orphans: 3;
            widows: 3;
        }}
    </style>
</head>
<body>
{html_body}
</body>
</html>
"""
    
    return html_template

def save_pdf(html_content, output_file):
    """Guarda el HTML como PDF usando WeasyPrint"""
    try:
        from weasyprint import HTML, CSS
        
        # Convertir rutas relativas de imágenes
        base_path = Path(output_file).parent
        
        HTML(string=html_content, base_url=str(base_path)).write_pdf(
            output_file,
            stylesheets=[CSS(string='''
                @page {
                    size: A4;
                    margin: 2cm;
                }
            ''')]
        )
        print(f"✅ PDF generado exitosamente: {output_file}")
        return True
    except ImportError:
        print("❌ Error: WeasyPrint no está instalado.")
        print("Instala con: pip install WeasyPrint")
        return False
    except Exception as e:
        print(f"❌ Error al generar PDF: {e}")
        return False

def main():
    # Rutas de archivos
    readme_path = Path(__file__).parent / "README.md"
    output_pdf = Path(__file__).parent / "Documentacion_WRF_Mesoescalar.pdf"
    
    print("🔄 Iniciando conversión de README.md a PDF...")
    print(f"📄 Archivo de entrada: {readme_path}")
    print(f"📑 Archivo de salida: {output_pdf}")
    
    # Verificar que existe el README
    if not readme_path.exists():
        print(f"❌ Error: No se encuentra el archivo {readme_path}")
        return
    
    # Convertir Markdown a HTML
    print("🔄 Convirtiendo Markdown a HTML...")
    html_content = convert_markdown_to_html(readme_path)
    
    # Guardar como PDF
    print("🔄 Generando PDF...")
    success = save_pdf(html_content, str(output_pdf))
    
    if success:
        print("\n✅ ¡Conversión completada exitosamente!")
        print(f"📁 Ubicación del PDF: {output_pdf}")
        print(f"📊 Tamaño: {output_pdf.stat().st_size / 1024:.2f} KB")
    else:
        # Intentar método alternativo con reportlab
        print("\n🔄 Intentando método alternativo...")
        try_alternative_pdf(readme_path, output_pdf)

def try_alternative_pdf(readme_path, output_pdf):
    """Método alternativo usando markdown2 + xhtml2pdf"""
    try:
        import markdown2
        from xhtml2pdf import pisa
        
        print("🔄 Usando método alternativo (xhtml2pdf)...")
        
        with open(readme_path, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        html = markdown2.markdown(md_content, extras=['tables', 'fenced-code-blocks'])
        
        html_full = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page {{
                    size: A4;
                    margin: 2.5cm 2cm;
                }}
                
                body {{ 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    margin: 0;
                    padding: 0;
                    line-height: 1.4;
                    text-align: justify;
                    color: #333;
                }}
                
                h1 {{ 
                    color: #2c3e50; 
                    border-bottom: 3px solid #3498db;
                    padding-bottom: 8px;
                    margin-top: 25px;
                    margin-bottom: 15px;
                    font-size: 24px;
                    text-align: left;
                    page-break-after: avoid;
                }}
                
                h2 {{ 
                    color: #34495e;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 6px;
                    margin-top: 20px;
                    margin-bottom: 12px;
                    font-size: 20px;
                    text-align: left;
                    page-break-after: avoid;
                }}
                
                h3 {{
                    color: #555;
                    margin-top: 16px;
                    margin-bottom: 10px;
                    font-size: 16px;
                    text-align: left;
                    page-break-after: avoid;
                }}
                
                h4 {{
                    color: #666;
                    margin-top: 14px;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: left;
                    page-break-after: avoid;
                }}
                
                p {{ 
                    margin: 8px 0;
                    text-align: justify;
                    line-height: 1.4;
                }}
                
                ul, ol {{ 
                    margin: 8px 0;
                    padding-left: 25px;
                    line-height: 1.3;
                }}
                
                li {{ 
                    margin-bottom: 4px;
                    text-align: justify;
                }}
                
                img {{ 
                    max-width: 90%;
                    height: auto;
                    display: block;
                    margin: 15px auto;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    padding: 5px;
                    background-color: #fff;
                    page-break-inside: avoid;
                }}
                
                code {{ 
                    background-color: #f4f4f4; 
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                }}
                
                pre {{
                    background-color: #f8f8f8;
                    border: 1px solid #ddd;
                    border-left: 4px solid #3498db;
                    padding: 12px;
                    margin: 10px 0;
                    overflow-x: auto;
                    border-radius: 4px;
                    page-break-inside: avoid;
                }}
                
                pre code {{
                    background-color: transparent;
                    padding: 0;
                }}
                
                table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin: 12px 0;
                    page-break-inside: avoid;
                }}
                
                table th, table td {{
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                }}
                
                table th {{
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }}
                
                table tr:nth-child(even) {{
                    background-color: #f9f9f9;
                }}
                
                hr {{
                    border: none;
                    border-top: 2px solid #3498db;
                    margin: 25px 0;
                }}
                
                blockquote {{
                    border-left: 4px solid #3498db;
                    padding-left: 15px;
                    margin: 10px 0;
                    color: #555;
                    font-style: italic;
                }}
                
                strong, b {{
                    font-weight: bold;
                    color: #2c3e50;
                }}
                
                /* Mejorar paginación */
                h1, h2, h3, h4, h5, h6 {{
                    page-break-after: avoid;
                }}
                
                p, li {{
                    orphans: 3;
                    widows: 3;
                }}
                
                /* Estilo para descripciones de figuras */
                em {{
                    font-style: italic;
                    color: #666;
                }}
            </style>
        </head>
        <body>
        {html}
        </body>
        </html>
        """
        
        with open(output_pdf, "wb") as pdf_file:
            pisa_status = pisa.CreatePDF(html_full, dest=pdf_file)
        
        if not pisa_status.err:
            print(f"✅ PDF generado con método alternativo: {output_pdf}")
        else:
            print("❌ Error con método alternativo")
            
    except ImportError:
        print("❌ Paquetes alternativos no disponibles.")
        print("Instala con: pip install markdown2 xhtml2pdf")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
