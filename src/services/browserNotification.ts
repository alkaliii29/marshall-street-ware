/**
 * Browser Notification Service for Marshall Street Wear
 * Safely handles permission requests and triggers desktop/system notifications.
 */

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return Notification.permission;
    }
  }

  return Notification.permission;
}

export function triggerOrderNotification(orderId?: string, productName?: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.info('Browser notifications are not supported in this environment.');
    return;
  }

  const fire = () => {
    try {
      new Notification('Marshall Street Wear', {
        body: 'Your order has been confirmed!',
      });
    } catch (err) {
      console.warn('Unable to display browser notification:', err);
    }
  };

  if (Notification.permission === 'granted') {
    fire();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        fire();
      }
    });
  }
}
