import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css'],
})
export class UserRegister implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
     private cdr: ChangeDetectorRef
  ) {}

  showPassword: boolean = false;
  cityList: any[] = [];
  filterCityList:any[]=[]
  isPasswordMatching: boolean = true;
  successAlert: boolean = false;
  ngOnInit() {
    this.createForm();
    this.getCityList();
  }

  createForm() {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      Mobile: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$'), Validators.maxLength(10)],
      ],
      DateofBirth: ['', [Validators.required,this.ageValidator]],
      Password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
      currentCity: [''],
    });
  }


  ageValidator(control: any) {

  const selectedDate = new Date(control.value);

  const today = new Date();

  let age =
    today.getFullYear() -
    selectedDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    selectedDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() <
      selectedDate.getDate())
  ) {
    age--;
  }

  return age >= 18
    ? null
    : { underAge: true };
}

  getCityList() {

    const body={
      country:'India'
    }

    this.http.post<any>('https://countriesnow.space/api/v0.1/countries/cities',body).subscribe((res)=>{
      this.cityList = res.data;
      // console.log(this.cityList); 
    })

    
  }


  filterCity(){
    const searchTerm = this.registrationForm.get('currentCity')?.value.toLowerCase().trim();
   if(searchTerm){
    this.filterCityList = this.cityList.filter((city:any) =>
      city.toLowerCase().includes(searchTerm)
    );
   }else{
    this.filterCityList = [];
   }
  }
  
  
  onSubmit() {
    const password = this.registrationForm.value.Password;

    const confirmPassword = this.registrationForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.isPasswordMatching = false;
      return;
    }else this.isPasswordMatching = true;

    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
       this.successAlert = true;

      setTimeout(() => {
        this.successAlert = false;
        this.cdr.detectChanges();


      }, 1000);
    } else {
      this.registrationForm.markAllAsTouched();
      console.log('Form is invalid');
      this.successAlert = false;
    }
  }
}
