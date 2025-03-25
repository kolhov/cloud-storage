import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import bytes from 'bytes';
import prettyMilliseconds from 'pretty-ms'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value
    = typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

export function convertDateFromIso(isoDate: string){
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function bytesToString(byte: number | undefined | null){
  if (byte) return bytes(byte, {unitSeparator: ' '});
  return null;
}

export function secondsToString(seconds: number | undefined){
  if (seconds) return prettyMilliseconds(seconds * 1000, { secondsDecimalDigits: 0 });
}

export function downloadFileWithIframe(downloadUrl: string) {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = downloadUrl
  document.body.appendChild(iframe)
  setTimeout(() => {
    document.body.removeChild(iframe)
  }, 1000)
}
