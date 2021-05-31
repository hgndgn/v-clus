import * as isIP from 'is-ip';

import { isInteger, toInteger } from 'lodash';

import { EventEmitter } from '@angular/core';

export function getEc2StateClass(state: string) {
  switch (state) {
    case 'running':
      return 'is-success';
    case 'stopped':
      return 'stopped-state';
    case 'terminated':
      return 'is-danger';
    default:
      return 'is-warning';
  }
}

export function isClientError(err: any) {
  if (isInteger(err)) return false;
  if (!err) return true;
  return (err.code && err.message) || (err._code && err._message);
}

export const closeOnEscapeClicked = (
  window: Window,
  emitter: EventEmitter<any>
) => {
  window.addEventListener('keydown', (e) => {
    if (e.keyCode == 27) {
      emitter.emit();
    }
  });
};

export const trimStrings = (object: any) => {
  if (!object) return;

  Object.keys(object).forEach(key => {
    const value = object[key];
    if (typeof (value) == 'string') {
      object[key] = object[key].trim()
    }
  })
}

export const isValidCidrBlock = (cidr: string) => {
  const splitted = cidr.split('/');
  if (splitted.length > 2) return false;

  const [ip, size] = splitted;

  if (ip == '0.0.0.0') {
    return false;
  }

  if (!isIP.v4(ip)) {
    return false;
  }

  const sizeInt = toInteger(size);
  if (sizeInt < 16 || sizeInt > 28) {
    return false;
  }

  return { ip, size }
}