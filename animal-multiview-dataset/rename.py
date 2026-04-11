import os

base_path = "."

for animal_folder in os.listdir(base_path):
    animal_path = os.path.join(base_path, animal_folder)

    if not os.path.isdir(animal_path):
        continue

    # go inside animal folder
    for view_folder in os.listdir(animal_path):
        view_path = os.path.join(animal_path, view_folder)

        if not os.path.isdir(view_path):
            continue

        # skip folders not like bull_back
        if "_" not in view_folder:
            print(f"Skipping folder: {view_folder}")
            continue

        for i, filename in enumerate(os.listdir(view_path)):
            ext = filename.split(".")[-1]
            new_name = f"{view_folder}_{i+1}.{ext}"

            old_file = os.path.join(view_path, filename)
            new_file = os.path.join(view_path, new_name)

            os.rename(old_file, new_file)

print("Renaming done ✅")