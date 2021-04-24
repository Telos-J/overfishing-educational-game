class Cup:
    def __init__(self, size, color):
        self.size = size
        self.color = color
        self.full = True

    def pour(self):
        self.full = False

    def __str__(self):
        return "size" + str(self.size) + " color" + str(self.color)

mug = Cup(10, 'white')
teacup = Cup(1, 'white')

print(mug)