/**
 * Booking CTA Plugin
 * 예약/상담/체험수업 CTA 변주 프롬프트
 */

import type { Plugin } from '@/types/plugin';

export interface BookingCtaConfig {
  bookingType?: 'reservation' | 'consultation' | 'trial' | 'appointment';
  method?: 'phone' | 'online' | 'in_person' | 'link';
  specialOffer?: string;
  availability?: string;
}

export const bookingCtaPlugin: Plugin<BookingCtaConfig> = {
  id: 'bookingCta',
  renderGuide(config?: BookingCtaConfig): string {
    const guide: string[] = [];

    guide.push('Generate compelling booking/reservation call-to-action that:');
    guide.push('1. Creates urgency without being pushy');
    guide.push('2. Highlights benefits of booking/reserving');
    guide.push('3. Makes the booking process sound easy');
    guide.push('4. Includes specific action items (call, book online, etc.)');
    guide.push('5. Uses time-sensitive language when appropriate');
    guide.push('6. Encourages immediate action');

    if (config?.bookingType) {
      switch (config.bookingType) {
        case 'reservation':
          guide.push('\nBooking Type: Reservation');
          guide.push('- Emphasize securing a spot');
          guide.push('- Highlight popular time slots');
          guide.push('- Mention benefits of reserving in advance');
          break;
        case 'consultation':
          guide.push('\nBooking Type: Consultation');
          guide.push('- Emphasize personalized service');
          guide.push('- Highlight expertise and advice');
          guide.push('- Create anticipation for the consultation');
          break;
        case 'trial':
          guide.push('\nBooking Type: Trial');
          guide.push('- Emphasize risk-free experience');
          guide.push('- Highlight what they will experience');
          guide.push('- Create excitement about trying something new');
          break;
        case 'appointment':
          guide.push('\nBooking Type: Appointment');
          guide.push('- Emphasize convenience and scheduling');
          guide.push('- Highlight availability of preferred times');
          guide.push('- Make booking process sound simple');
          break;
      }
    }

    if (config?.method) {
      switch (config.method) {
        case 'phone':
          guide.push('\nBooking Method: Phone');
          guide.push('- Include phone number in CTA');
          guide.push('- Emphasize quick and easy phone booking');
          guide.push('- Mention friendly staff ready to help');
          break;
        case 'online':
          guide.push('\nBooking Method: Online');
          guide.push('- Emphasize convenience of online booking');
          guide.push('- Highlight 24/7 availability');
          guide.push('- Mention quick and easy process');
          break;
        case 'in_person':
          guide.push('\nBooking Method: In Person');
          guide.push('- Mention visit location');
          guide.push('- Emphasize personal interaction');
          guide.push('- Highlight immediate availability');
          break;
        case 'link':
          guide.push('\nBooking Method: Link');
          guide.push('- Include booking link');
          guide.push('- Emphasize direct access');
          guide.push('- Highlight seamless experience');
          break;
      }
    }

    if (config?.specialOffer) {
      guide.push(`\nSpecial Offer: ${config.specialOffer}`);
      guide.push('- Emphasize the special value');
      guide.push('- Create urgency to take advantage');
    }

    if (config?.availability) {
      guide.push(`\nAvailability: ${config.availability}`);
      guide.push('- Highlight limited availability if applicable');
      guide.push('- Create urgency if spots are limited');
    }

    guide.push('\nCTA variations to consider:');
    guide.push('- "Book now and secure your spot!"');
    guide.push('- "Reserve your appointment today!"');
    guide.push('- "Schedule your consultation now!"');
    guide.push('- "Don\'t miss out - book today!"');
    guide.push('- "Ready to get started? Book now!"');

    guide.push('\nImportant compliance notes:');
    guide.push('- Avoid using banned phrases from domain profile');
    guide.push('- Do not make false promises about availability');
    guide.push('- Clearly state booking terms if applicable');
    guide.push('- Maintain professional and welcoming tone');

    return guide.join('\n');
  },
};
