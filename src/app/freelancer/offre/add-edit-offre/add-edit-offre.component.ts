import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Offre } from 'src/app/models/offre';
import { OffreService } from 'src/app/services/offre.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomaineExpertise } from 'src/app/models/domaine-expertise';
import { Technologie } from 'src/app/models/technologie';
import * as alertifyjs from 'alertifyjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductImages } from 'src/app/models/product-images';
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-edit-offre',
  templateUrl: './add-edit-offre.component.html',
  styleUrls: ['./add-edit-offre.component.scss']
})
export class AddEditOffreComponent implements OnInit{
  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
       this.id_user = user.id;  
            
    }
  }
  domaineExpertiseOptions = Object.values(DomaineExpertise);
  technologieOptions = Object.values(Technologie);

  selectedFile!: File;
  offre:Offre ={
    description: 'qsdqsd',
    prix_heure: 50,
    domaineExpertise: DomaineExpertise.DEVELOPPEMENT_LOGICIEL,
    technologie: Technologie.ANDROID,
    freelancer: { id: 1 }, // Assuming you have a User interface as well
    productImagess: [],
    id: 0
  };

  editmode: boolean = false;
  editdata: any;
  respdata: any;
//  Reactiveform: FormGroup;
  id_user: any;
  constructor(private snackBar: MatSnackBar,private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private offreService: OffreService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditOffreComponent>
  )  {
    //this.Reactiveform = this.formBuilder.group({
     // id: [null, Validators.required],
   //   description: [null, Validators.required],
    //  prix_heure: [null, Validators.required],
    //  domaineExpertise: [null, Validators.required], 
 //     technologie: [null, Validators.required],
    //  productImages: [this.selectedFile,Validators.required],
     // freelancer:[this.id_user, Validators.required],
      // Add other form controls based on your Offre interface
    }
   // );

  //  if (data && data.offre) {
    //  this.editmode = true;
    //  this.Reactiveform.patchValue(data.offre);
   // }
  //}




  
  getReservFormData() {
    //this.addOffre();
  }


  //addOffre() {

    
   //console.log();
   // this.offreService.addOffretWithImages(this.offre)

    //.subscribe(result => {
    //  this.respdata = result;
     /// if (this.respdata) {
     //   this.dialogRef.close();
    //    this.showSuccessMessage();
   //   }
    //  location.reload();
   // });
  //}

  showSuccessMessage() {
    const config = new MatSnackBarConfig();
    config.duration = 3000; // Duration in milliseconds
    config.horizontalPosition = 'center'; // Set the horizontal position to center
    config.verticalPosition = 'top'; // Set the vertical position to top
  
    this.snackBar.open('Formation Ajoutée!', 'Close', config);
  }








  addProduct(offreForm: NgForm) {
    console.log(this.offre);
    const formData = this.prepareFormDataForProduct(this.offre);
    this.offreService.addOffretWithImages(formData).subscribe(
      (response: Offre) => {
       offreForm.reset();
        this.offre.productImagess = [];
        if (this.offre.productImagess) {
          this.dialogRef.close();
          this.showSuccessMessage();
        }
        location.reload();
      
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  prepareFormDataForProduct(offre: Offre): FormData {
    const uploadImageData = new FormData();
  
    // Check if this.offre and this.offre.productImages are defined
    if (this.offre && this.offre.productImagess) {
      // Append the Offre object as JSON
      uploadImageData.append(
        'offre',
        new Blob([JSON.stringify(offre)], { type: 'application/json' })
      );
  
      // Append each image file
      for (var i = 0; i < this.offre.productImagess.length; i++) {
        const file = this.offre.productImagess[i].file;
        
        // Check if the file is defined before appending
        if (file) {
          uploadImageData.append('imageFile', file, file.name);
        }
      }
    }
  
    return uploadImageData;
  }

  onFileSelected(event: any) {
    if (this.offre && event.target.files) {
      const file = event.target.files[0];
  
      // Check if file is defined before accessing its properties
      if (file) {
        const fileHandle: ProductImages = {
          file: file,
          url: this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(file)
          ),
          id: 0,
          name: ''
        };
  
        // Check if this.offre.productImages is defined before pushing
        if (this.offre.productImagess) {
          console.log(this.offre.productImagess);
          this.offre.productImagess.push(fileHandle);
        } else {
          // If this.offre.productImages is undefined, create a new array with the file
          this.offre.productImagess = [fileHandle];
          console.log(this.offre.productImagess);
        }
      }
    }
  }
  













}
