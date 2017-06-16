import { Component, AfterViewInit, Inject, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidators, EmailValidators } from 'ng2-validators'

declare var $: any;

@Component({
    selector: 'auth-register',
    templateUrl: './auth-register.component.html',
    styleUrls: ['./auth-register.component.css', '../../../editor/styles/forms.styles.css']
})
export class AuthRegisterComponent implements OnInit {

    private model: UserFormModel = new UserFormModel();

    private card: any = null;

    private stripePayments: any = null;

    public testform: FormGroup;

    constructor(private http: Http, @Inject(FormBuilder) private fbuilder: FormBuilder, private router: Router) {
        this.stripePayments = (<any>window).Stripe('pk_test_2aY90aBzzGZfKoN07qECdHvB');


    }

    ngOnInit(): void {
        this.constructForm();
    }

    ngAfterViewInit() {
        
        // Create an instance of Elements
        var elements = this.stripePayments.elements();

        // Custom styling can be passed to options when creating an Element.
        // (Note that this demo uses a wider set of styles than the guide below.)
        var style = {
            base: {
                color: '#32325d',
                lineHeight: '24px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        // Create an instance of the card Element
        this.card = elements.create('card', { style: style });

        // Add an instance of the card Element into the `card-element` <div>
        this.card.mount('#card-element');
        
    }

    onSubmit() {
        this.createToken();
    }

    private constructForm() {


        let passwordControl: FormControl = new FormControl
            (
            "", Validators.compose
                (
                [
                    PasswordValidators.alphabeticalCharacterRule(1),
                    PasswordValidators.digitCharacterRule(1),
                    PasswordValidators.lowercaseCharacterRule(1),
                    PasswordValidators.uppercaseCharacterRule(1),
                    PasswordValidators.specialCharacterRule(1),
                    Validators.minLength(8),
                    Validators.required
                ]
                )
            );

        this.testform = this.fbuilder.group({
            'firstname': ['', Validators.compose([Validators.required])],
            'lastname': ['', Validators.compose([Validators.required])],
            'email': ['', Validators.compose([EmailValidators.normal, Validators.required])],
            'newPassword': passwordControl,
            'confirmPassword': ["", Validators.required]
        });

        this.testform.setValidators(PasswordValidators.mismatchedPasswords());

    }

    // Create token
    private createToken() {

        if (this.card == null) return;

        this.stripePayments.createToken(this.card).then((result) => {
            if (result.error) {

                // Inform the user if there was an error
                var errorElement = $('#card-errors');
                errorElement.textContent = result.error.message;

            } else {
                console.log(result);

                // Send the token to your server
                this.register(result.token);

            }
        });
    }

    private register(token: any) {

        var form = this.testform.value;
        var email = form["email"];
        var password = form["newPassword"];

        let data =
            {
                email: email,
                password: password,
                token: token,
                tokenID: token["id"]
            }

        let payload = JSON.stringify(data);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let url = '/Auth/Subscribe';

        this.http.post(url, payload, options).subscribe(
            (response) => {

                var statuscode = response.status;

                if(response.ok)
                {
                    this.onSuccess();
                }
                else
                {
                    var resp = response.text();
                    var json = JSON.parse(resp);
                    console.log(json);
                }
            },
            (err) => {
                /* this function is executed when there's an ERROR */
                console.log("ERROR: " + err);
            },
            () => {
                /* this function is executed when the observable ends (completes) its stream */
                console.log("COMPLETED");
            }
        );
    }

    private onSuccess() {
        window.location.href = "https://statisfaction.tech/client/statistics";
    }

    private onServerError()
    {
        alert("Oh, there was an error! Please contact the Statisfaction Team!");
    }
}

export class UserFormModel {

    public email: string = "";
    public password: string = "";
    public confirmPassword: string = "";

    public firstName: string = "";
    public lastName: string = "";

}