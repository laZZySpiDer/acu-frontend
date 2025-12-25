import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-shipping-policy',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './shipping-policy.component.html',
    styleUrls: ['./shipping-policy.component.css']
})
export class ShippingPolicyComponent { }
