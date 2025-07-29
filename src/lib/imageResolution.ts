import toast from 'react-hot-toast';

export async function convertTo16by9(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const ratio = width / height;
      const targetRatio = 16 / 9;

      let cropX = 0,
        cropY = 0,
        cropWidth = width,
        cropHeight = height;

      // CROP ke tengah agar jadi 16:9
      if (Math.abs(ratio - targetRatio) > 0.01) {
        if (ratio > targetRatio) {
          // Terlalu lebar → crop sisi kiri dan kanan
          cropWidth = height * targetRatio;
          cropX = (width - cropWidth) / 2;
        } else {
          // Terlalu tinggi → crop atas dan bawah
          cropHeight = width / targetRatio;
          cropY = (height - cropHeight) / 2;
        }

        console.log('🔧 Gambar dikonversi ke 16:9 dengan crop');
      }

      // Resize ke 1280x720
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas error'));

      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, 1280, 720);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Konversi gagal'));
        const newFile = new File([blob], file.name, { type: file.type });
        resolve(newFile);
      }, file.type);
    };

    img.onerror = () => reject(new Error('Gagal memuat gambar'));
  });
}

export async function validateResolution(file: File) {
  const isValidResolution = await new Promise<boolean>((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const ratio = width / height;
      const isHD = width >= 1280 && height >= 720;
      const is16by9 = Math.abs(ratio - 16 / 9) < 0.01;

      console.log(
        'width:',
        width,
        'height:',
        height,
        'ratio:',
        ratio.toFixed(2)
      );

      resolve(isHD && is16by9);
    };

    img.onerror = () => resolve(false);
  });

  if (!isValidResolution) {
    toast.error(
      'Gambar harus berukuran minimal 1280x720 dan rasio 16:9 seperti YouTube'
    );
    return;
  }
}
