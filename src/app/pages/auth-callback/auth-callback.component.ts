import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-auth-callback',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-700">Authenticating...</h2>
        <p class="text-gray-500 mt-2">Please wait while we complete your login.</p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        // Extract token from URL hash
        const hash = window.location.hash;
        console.log(hash);
        if (hash) {
            const params = new URLSearchParams(hash.substring(1)); // remove the '#'
            const accessToken = params.get('access_token');
            console.log(accessToken);
            if (accessToken) {
                this.authService.handleOAuthCallback(accessToken).subscribe({
                    next: () => {
                        this.router.navigate(['/']);
                    },
                    error: (err) => {
                        console.error('OAuth Callback Error:', err);
                        this.router.navigate(['/login'], { queryParams: { error: 'oauth_failed' } });
                    }
                });
            } else {
                console.error('No access token found in hash');
                this.router.navigate(['/login'], { queryParams: { error: 'no_token' } });
            }
        } else {
            console.error('No hash found in URL');
            this.router.navigate(['/login'], { queryParams: { error: 'no_hash' } });
        }
    }
}
