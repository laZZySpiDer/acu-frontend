import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
    question: string;
    answer: string;
}

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './faq.component.html',
})
export class FaqComponent {
    faqs: FaqItem[] = [
        {
            question: 'When will I receive my order?',
            answer: 'After placing your order, your package will be delivered at your doorstep within 4-7 working days for ‘Ready to purchase products’ and within 5-12 working days for custom orders.'
        },
        {
            question: 'How do I track my order?',
            answer: 'Once your order ships, you will receive an email with a tracking number and a link to track your package.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
        },
        {
            question: 'Can I change my order after placing it?',
            answer: 'We process orders quickly, but if you contact us within 1 hour of placing your order, we may be able to make changes.'
        },
        {
            question: 'Are these wooden dolls waterproof?',
            answer: 'The dolls are sealed with a matte finish and are water resistant. You can wipe off the dust with a damp cloth. Kindly avoid immersing dolls in water completely.'
        }
    ];

    openIndex: number | null = null;

    toggle(index: number) {
        this.openIndex = this.openIndex === index ? null : index;
    }
}
