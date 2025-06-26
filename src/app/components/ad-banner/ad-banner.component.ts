import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Component({
  selector: 'app-ad-banner',
  standalone: false,
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.scss']
})
export class AdBannerComponent implements OnInit, OnDestroy {
  @Input() adSlot!: string;
  @Input() adFormat: string = 'auto';
  showAd = false;
  private adInitialized = false;

  ngOnInit() {
    if (this.shouldLoadAd()) {
      this.initializeAd();
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  private shouldLoadAd(): boolean {
    // Don't load ads in development mode
    if (!environment.production) return false;

    // Check if this specific ad slot has already been loaded
    const existingAds = document.querySelectorAll(`ins.adsbygoogle[data-ad-slot="${this.adSlot}"]`);
    return existingAds.length === 0 || !this.hasAdContent(existingAds[0]);
  }

  private hasAdContent(adElement: Element): boolean {
    return adElement?.children?.length > 0;
  }

  private initializeAd() {
    if (this.adInitialized) return;

    this.adInitialized = true;
    this.showAd = true; // Show the ad container initially

    // Load with a small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        if (typeof window.adsbygoogle === 'undefined') {
          this.loadAdSenseScript();
        } else {
          this.pushAd();
        }
      } catch (e) {
        console.error('AdSense initialization error:', e);
        this.hideAd();
      }
    }, 100);
  }

  private loadAdSenseScript() {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.onload = () => this.pushAd();
    script.onerror = () => this.hideAd();
    document.head.appendChild(script);
  }

  private pushAd() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});

      // Verify ad loaded after delay
      setTimeout(() => {
        const adElement = document.querySelector(`ins.adsbygoogle[data-ad-slot="${this.adSlot}"]`);
        if (!adElement || !this.hasAdContent(adElement)) {
          this.hideAd();
        }
      }, 3000);
    } catch (e) {
      console.error('AdSense push error:', e);
      this.hideAd();
    }
  }

  private hideAd() {
    this.showAd = false;
    // Clean up any ad elements if needed
    const adElement = document.querySelector(`ins.adsbygoogle[data-ad-slot="${this.adSlot}"]`);
    if (adElement) {
      adElement.remove();
    }
  }

  refreshAd() {
    if (!environment.production) return;

    const adElement = document.querySelector(`ins.adsbygoogle[data-ad-slot="${this.adSlot}"]`);
    if (adElement) {
      adElement.innerHTML = '';
      this.showAd = true;
      this.pushAd();
    }
  }
}
