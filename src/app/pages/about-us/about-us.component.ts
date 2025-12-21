import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-about-us',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent {
    // Logic can be added here if dynamic content is needed in the future
}
