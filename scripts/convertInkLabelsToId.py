import xml.etree.ElementTree as ET
from xml.dom import minidom

# Charger le fichier SVG source
input_file = "gravemap_inkproject.svg"  # Nom du fichier SVG original
output_file = "gravemap_rework_inkproject.svg"  # Nom du fichier modifié

# Charger et analyser le fichier SVG
tree = ET.parse(input_file)
root = tree.getroot()

# Espace de noms utilisé par Inkscape
namespaces = {
    'inkscape': 'http://www.inkscape.org/namespaces/inkscape',
    'svg': 'http://www.w3.org/2000/svg'
}

# Supprimer les préfixes (ns0, ns1) pour une sortie plus propre
for ns_prefix in namespaces.keys():
    ET.register_namespace(ns_prefix, namespaces[ns_prefix])

# Fonction pour mettre à jour les IDs
def update_ids(root):
    for second_level_g in root.findall(".//svg:g", namespaces):  # Trouver tous les groupes <g>
        # Vérifier si le groupe a un inkscape:label
        lot_id = second_level_g.attrib.get("{http://www.inkscape.org/namespaces/inkscape}label", None)
        if lot_id:  # Si un label existe
            # Attribuer l'ID au groupe
            second_level_g.attrib['id'] = lot_id

            # Modifier les enfants <rect> et <path>
            for child in second_level_g:
                if child.tag.endswith("rect") or child.tag.endswith("path"):
                    label = child.attrib.get("{http://www.inkscape.org/namespaces/inkscape}label", None)
                    if label:
                        # Attribuer un ID combiné au format lotId#label
                        child.attrib['id'] = f"{lot_id}#{label}"

# Appliquer les modifications
update_ids(root)

# Reformater le fichier pour une meilleure lisibilité
def prettify(element):
    rough_string = ET.tostring(element, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

# Sauvegarder dans le fichier de sortie
with open(output_file, "w", encoding="utf-8") as f:
    f.write(prettify(root))

print(f"Fichier modifié créé : {output_file}")
