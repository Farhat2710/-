
import React from 'react';
import { 
  Glasses, 
  Palette, 
  Mic2, 
  Box, 
  Camera, 
  Music,
  LucideIcon
} from 'lucide-react';
import { StudioType, StudioInfo } from './types';

export const STUDIOS: StudioInfo[] = [
  {
    type: StudioType.VR_AR,
    icon: 'Glasses',
    description: 'Миры дополненной и виртуальной реальности. Здесь мы создаем будущее.',
    color: '#FF6B00'
  },
  {
    type: StudioType.GRAPHIC_DESIGN,
    icon: 'Palette',
    description: 'Визуальный язык и брендинг. Здесь родился Креатик!',
    color: '#FFD700'
  },
  {
    type: StudioType.SOUND_ENGINEERING,
    icon: 'Mic2',
    description: 'Магия звука, запись голоса и создание чистых аудио-ландшафтов.',
    color: '#FF8A00'
  },
  {
    type: StudioType.ANIMATION_3D,
    icon: 'Box',
    description: 'Оживляем персонажей и строим трехмерные вселенные.',
    color: '#FFA500'
  },
  {
    type: StudioType.PHOTO_VIDEO,
    icon: 'Camera',
    description: 'Искусство кадра и монтажа. Сохраняем моменты в движении.',
    color: '#FF4500'
  },
  {
    type: StudioType.ELECTRONIC_MUSIC,
    icon: 'Music',
    description: 'Синтез звука, биты и современный саунд-дизайн.',
    color: '#FFC107'
  }
];

export const getIcon = (name: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Glasses,
    Palette,
    Mic2,
    Box,
    Camera,
    Music
  };
  return icons[name] || Box;
};
