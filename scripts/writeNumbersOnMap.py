import xml.etree.ElementTree as ET
import cairosvg

# Charger le fichier SVG source
input_file = "gravemap.svg"  # Nom du fichier SVG original
output_file = "fichier_avec_texte.svg"  # Nom du fichier modifié
output_png_file = "fichier_avec_texte.png"  # Nom du fichier PNG

# Charger et analyser le fichier SVG
tree = ET.parse(input_file)
root = tree.getroot()

# Espace de noms utilisé par Inkscape (si nécessaire)
namespaces = {'inkscape': 'http://www.inkscape.org/namespaces/inkscape'}

# Nouvelle liste pour les rects à une profondeur de 3
rects_to_label = []

# Fonction pour parcourir les éléments à la recherche de rects à une profondeur de 3
def find_rects_at_depth_3(element, depth=0):
    # If the depth is 3
    if depth == 3:
        rects_to_label.append(element)
    for child in element:
        find_rects_at_depth_3(child, depth + 1)

# Trouver tous les rects à une profondeur de 3
find_rects_at_depth_3(root)

# Créer un nouvel arbre SVG pour le fichier de sortie
new_svg = ET.Element("svg", {
    "xmlns": "http://www.w3.org/2000/svg",
    "xmlns:inkscape": "http://www.inkscape.org/namespaces/inkscape",
    "width": root.attrib.get("width", "100%"),
    "height": root.attrib.get("height", "100%"),
})

# Ajouter les rects originaux et les textes correspondants
for rect in rects_to_label:
    # If react is a path just copy it
    if rect.tag.endswith("path"):
        new_rect = ET.SubElement(new_svg, "path", rect.attrib)
        continue
        
    # Copier les propriétés du rectangle
    new_rect = ET.SubElement(new_svg, "rect", rect.attrib)
    
    # not "PATH" in element.attrib.get("id", ""):
    if "PATH" not in rect.attrib.get("id", ""):
        # Ajouter un texte avec l'ID au centre du rectangle
        x = float(rect.attrib.get("x", "0"))
        y = float(rect.attrib.get("y", "0"))
        width = float(rect.attrib.get("width", "0"))
        height = float(rect.attrib.get("height", "0"))
        center_x = x + width / 2
        center_y = y + height / 2

        # Ajouter un texte avec l'ID au centre du rectangle
        rect_id = rect.attrib.get("id", "no_id")
        ET.SubElement(new_svg, "text", {
            "x": str(center_x),
            "y": str(center_y),
            "text-anchor": "middle",
            "dominant-baseline": "central",
            "font-size": "4",
            "fill": "black"
        }).text = rect_id.split("#")[-1]

# Sauvegarder le nouveau fichier SVG
new_tree = ET.ElementTree(new_svg)
new_tree.write(output_file, encoding="utf-8", xml_declaration=True)

print(f"Fichier créé : {output_file}")

# Lire le fichier SVG
with open(output_file, 'r') as file:
    svg_content = file.read()

# Modifier les dimensions du SVG
svg_content = svg_content.replace('width="200"', 'width="1024"')
svg_content = svg_content.replace('height="1024"', 'height="1024"')

# Convertir le fichier SVG modifié en PNG
cairosvg.svg2png(bytestring=svg_content.encode('utf-8'), write_to=output_png_file, background_color='white')

print(f"Fichier PNG créé : {output_png_file}")