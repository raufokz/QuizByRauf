import { Component, OnInit } from '@angular/core';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Component({
  selector: 'app-ad-banner',
  standalone: false,
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.css']
})
export class AdBannerComponent implements OnInit {
  showFallback = false;

  ngOnInit() {
    this.loadAdScript();
    setTimeout(() => {
      if (!this.isAdLoaded()) {
        this.showFallback = true;
      }
    }, 3000); // Show fallback after 3 seconds if ad doesn't load
  }

  private loadAdScript() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
      this.showFallback = true;
    }
  }

  private isAdLoaded(): boolean {
    const ads = document.getElementsByClassName('adsbygoogle');
    if (ads.length === 0) return false;
    return ads[0].children.length > 0;
  }

  refreshAd() {
    this.showFallback = false;
    this.loadAdScript();
  }
}
