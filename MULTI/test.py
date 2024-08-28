import os

print(os.getcwd())
dir_path = os.path.dirname(os.path.realpath(__file__))
dir_path2 = os.path.join(dir_path, r"static\data.txt")
os.chdir(dir_path)
print(os.getcwd())
print(dir_path)