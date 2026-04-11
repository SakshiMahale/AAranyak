import os
import pandas as pd

base_path = "."

data = []

for animal_folder in os.listdir(base_path):
    animal_path = os.path.join(base_path, animal_folder)

    if not os.path.isdir(animal_path):
        continue

    for view_folder in os.listdir(animal_path):
        view_path = os.path.join(animal_path, view_folder)

        if not os.path.isdir(view_path):
            continue

        # split only first underscore
        parts = view_folder.split("_", 1)

        if len(parts) < 2:
            print(f"Skipping folder: {view_folder}")
            continue

        animal = parts[0]
        view = parts[1]   # keeps "right_view", "left_view", etc.

        for file in os.listdir(view_path):
            data.append([file, view_folder, animal, view])

df = pd.DataFrame(data, columns=["image_name", "label", "animal", "view"])
df.to_csv("metadata.csv", index=False)

print("metadata.csv created ✅")