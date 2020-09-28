import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { timer, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null,
        [Validators.required, Validators // synchronize method - se povikuva dodeka korisnikot vnesuva vo poleto podatoci
          .pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
        [this.validateEmailNotTaken()] // asynchronize metod - se povikuva otakako ke pominat dvata validatori (required i pattern)
      ],
      password: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/shop');
    }, error => {
      console.log(error);
      this.errors = error.errors;
    });
  }

validateEmailNotTaken(): AsyncValidatorFn {
  return control => { // obsrvable
    return timer(500).pipe(
      switchMap(() => {
        if (!control.value) {
          return of(null);
        }
        return this.accountService.checkEmailExists(control.value).pipe(
          map(res => {
            return res ? { emailExists: true } : null; // email exits e ime na validatorot sto moze da se korisi vo html templejt
          })                               // primer: namesto Validators.required moze da se povika validateEmailNotTaken.emailExists
         );
      })
    );
  };
}
}
