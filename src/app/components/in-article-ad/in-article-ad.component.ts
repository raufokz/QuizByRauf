import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-in-article-ad',
  standalone: false,
  templateUrl: './in-article-ad.component.html',
  styleUrls: ['./in-article-ad.component.css']
})
export class InArticleAdComponent implements OnInit, OnDestroy {
  @Input() adSlot: string = '1234567890'; // Default slot
  @Input() sticky: boolean = false;
  showFallback: boolean = false;
  private adLoadAttempted: boolean = false;

  ngOnInit() {
    if (this.canShowAds()) {
      this.loadAd();
    } else {
      this.showFallback = true;
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private canShowAds(): boolean {
    // Add any logic to check if ads should be shown
    return true;
  }

  private loadAd() {
    if (this.adLoadAttempted) return;

    this.adLoadAttempted = true;

    try {
      setTimeout(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});

        // Check if ad loaded after 3 seconds
        setTimeout(() => {
          if (!this.isAdVisible()) {
            this.showFallback = true;
          }
        }, 3000);
      }, 500); // Small delay to ensure DOM is ready
    } catch (e) {
      console.error('Ad load error:', e);
      this.showFallback = true;
    }
  }

  private isAdVisible(): boolean {
    const ads = document.getElementsByClassName('adsbygoogle');
    if (!ads || ads.length === 0) return false;

    const adElement = ads[ads.length - 1] as HTMLElement;
    return adElement.offsetHeight > 0;
  }

  reloadAd() {
    this.showFallback = false;
    this.adLoadAttempted = false;
    this.loadAd();
  }
}
