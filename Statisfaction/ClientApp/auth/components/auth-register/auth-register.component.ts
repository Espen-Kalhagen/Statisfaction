import { Component, AfterViewInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

declare var $: any;

@Component({
    selector: 'auth-register',
    templateUrl: './auth-register.component.html',
    styleUrls: ['./auth-register.component.css']
})
export class AuthRegisterComponent {

    private model: UserFormModel = new UserFormModel();

    private card: any = null;

    private stripe: any = null;

    constructor(private http: Http) {
        this.stripe = (<any>window).Stripe('pk_test_2aY90aBzzGZfKoN07qECdHvB');
    }

    ngAfterViewInit() {


        // Create an instance of Elements
        var elements = this.stripe.elements();

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

    private createUserInStripe(identityKey: string) {
        var customer = this.stripe.customers.create({
            email: this.model.email,
            token: identityKey
        }, function (err, customer) {
            // asynchronously called
        });
    }

    // Registrer user at Stripe
    private createToken() {

        if (this.card == null) return;

        this.stripe.createToken(this.card).then((result) => {
            if (result.error) {

                // Inform the user if there was an error
                var errorElement = $('#card-errors');
                errorElement.textContent = result.error.message;

            } else {

                // Send the token to your server
                this.registerInIdentity(result.token);

            }
        });


        // Get token
        // Registrer in Identity
        // Register subscription
        // Success, redirect to login!
    }

    private registerInIdentity(token: string) {

        let payload = JSON.stringify(this.model);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let url = 'http://localhost:5000/Account/Register';

        this.http.post(url, payload, options).subscribe(
            (response) => {
                /* this function is executed every time there's a new output */
                var resp = response.json() ;
                
                var json = JSON.parse(resp);
                console.log(resp);
                console.log("ID: " + json["id"]);

                var result = response.json[""] ;
                //this.createUserInStripe("");
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

    private subscribe() {

    }

    private onSuccess() {

    }
}

export class UserFormModel {
    public email: string = "";
    public password: string = "";
    public confirmPassword: string = "";

}