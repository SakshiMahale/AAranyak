import cv2
import numpy as np

# 1. Load the image
img = cv2.imread('track.png', 0)
if img is None:
    print("Error: Could not load track.png")
    exit()

height, width = img.shape
split_x = int(width * 0.255) # The vertical flip point

# 2. SPLIT AND INDEPENDENTLY THRESHOLD
# Left Part: White Path on Black
left_part = img[:, :split_x-10]
_, left_bin = cv2.threshold(left_part, 200, 255, cv2.THRESH_BINARY)

# Right Part: Black Path on White
right_part = img[:, split_x+10:]
_, right_bin = cv2.threshold(right_part, 100, 255, cv2.THRESH_BINARY_INV)

# 3. MERGE INTO A UNIFIED WHITE-ON-BLACK MASK
# This combines both halves while leaving a gap at the transition line
full_mask = np.zeros_like(img)
full_mask[:, :split_x-10] = left_bin
full_mask[:, split_x+10:] = right_bin

# 4. CLEAN AND FAT_PATH (Dilation for Parallel Lanes)
# Close gaps in the dashed section
kernel_close = np.ones((15, 15), np.uint8)
full_mask = cv2.morphologyEx(full_mask, cv2.MORPH_CLOSE, kernel_close)

# Remove the 'IETE-ISP' watermark
kernel_open = np.ones((5, 5), np.uint8)
full_mask = cv2.morphologyEx(full_mask, cv2.MORPH_OPEN, kernel_open)

# Dilation: This makes the path 'fat' so the boundary gives two parallel lines
fat_path = cv2.dilate(full_mask, np.ones((7, 7), np.uint8), iterations=2)

# Clear the outer image border
margin = 25
fat_path[0:margin, :] = 0
fat_path[height-margin:height, :] = 0
fat_path[:, 0:margin] = 0
fat_path[:, width-margin:width] = 0

# 5. EXTRACT PARALLEL COORDINATES
# findContours traces the boundary (left side and right side of the fat line)
contours, _ = cv2.findContours(fat_path, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

all_points = []
sampling_step = 25 # Distance between dots along the path

for cnt in contours:
    if cv2.contourArea(cnt) > 1000:
        for i in range(0, len(cnt), sampling_step):
            x, y = cnt[i][0]
            all_points.append(f"{{ x: {x}, y: {y} }}")

# 6. OUTPUT TO JS FORMAT
js_output = "const rawPoints = [\n    " + ", ".join(all_points) + "\n];"

with open("parallel_lane_coords.txt", "w") as f:
    f.write(js_output)

print(f"Success! {len(all_points)} parallel lane dots saved.")