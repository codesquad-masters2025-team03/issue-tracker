import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

export default function ColorPicker() {
  const [color, setColor] = useState('#aabbcc'); // 초기값

  return (
    <div>
      <HexColorPicker color={color} onChange={setColor} />
      <div style={{ marginTop: 16 }}>
        선택한 색상: <strong>{color}</strong>
      </div>
    </div>
  );
}
