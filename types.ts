
export enum StudioType {
  VR_AR = 'VR/AR',
  GRAPHIC_DESIGN = 'Графический дизайн',
  SOUND_ENGINEERING = 'Звукорежиссура',
  ANIMATION_3D = '3D Анимация',
  PHOTO_VIDEO = 'Фото и видео',
  ELECTRONIC_MUSIC = 'Электронная музыка'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface StudioInfo {
  type: StudioType;
  icon: string;
  description: string;
  color: string;
}
