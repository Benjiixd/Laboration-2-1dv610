




class imageController {
  constructor() {
    this.model = new imageModel();
  }

  saveImage(image) {
    this.imageSaver.saveImage(image);
  }

    getImage() {
        return this.imageSaver.getImage();
    }




}