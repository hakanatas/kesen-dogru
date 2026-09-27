/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 6. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'a ve b paralel; k ikisini de kesiyor', en: 'a and b are parallel; k crosses both',
      note: 'a ve b doğruları paraleldir, hiç kesişmezler. k doğrusu ikisini de keser; k’ye kesen denir.' },
    { scene: 2, start: 10.8, end: 19.8, tr: 'İki kesişim noktası, 8 açı', en: 'Two crossings, eight angles',
      note: 'k doğrusu a’yı ve b’yi keserken iki kesişim noktası oluşur. Her noktada 4 açı var: toplam 8 açı. Onları 1’den 8’e numaralayalım.' },
    { scene: 2, start: 20.0, end: 27.8, tr: 'Yalnızca iki ölçü: 60° ve 120°', en: 'Only two measures: 60° and 120°',
      note: 'Açıları ölçelim. 1, 4, 5 ve 8 numaralı açılar 120°; 2, 3, 6 ve 7 numaralı açılar 60°. Sekiz açıda yalnızca iki farklı ölçü var!' },
    { scene: 3, start: 28.6, end: 36.8, tr: 'Paralellerin arasındakiler iç açılar', en: 'Angles between the parallels are interior',
      note: 'Açıları ayıralım. İki paralelin arasında kalan 3, 4, 5 ve 6 numaralı açılara iç açılar denir.' },
    { scene: 3, start: 37.0, end: 45.8, tr: 'Dışarıdakiler dış açılar', en: 'The others are exterior',
      note: 'Paralellerin dışında kalan 1, 2, 7 ve 8 numaralı açılara dış açılar denir.' },
    { scene: 4, start: 46.6, end: 52.0, tr: 'Yöndeş açılar eşittir', en: 'Corresponding angles are equal',
      note: 'Üstteki kesişimi kaydırıp alttakinin üzerine koyalım: tam üst üste gelir. Aynı yöne bakan bu açılara yöndeş açılar denir: 1 ve 5, 2 ve 6, 3 ve 7, 4 ve 8. Ölçüleri eşittir.' },
    { scene: 4, start: 52.4, end: 58.0, tr: 'İç ters açılar eşittir', en: 'Alternate interior angles are equal',
      note: 'Paralellerin arasında, kesenin iki yanında kalan 3 ve 6, 4 ve 5 numaralı açılara iç ters açılar denir. Ölçüleri eşittir.' },
    { scene: 4, start: 58.4, end: 64.0, tr: 'Dış ters açılar eşittir', en: 'Alternate exterior angles are equal',
      note: 'Paralellerin dışında, kesenin iki yanında kalan 1 ve 8, 2 ve 7 numaralı açılara dış ters açılar denir. Onlar da eşittir.' },
    { scene: 4, start: 64.4, end: 69.8, tr: 'Karşı durumlu açıların toplamı 180°', en: 'Same-side angles add up to 180°',
      note: 'Kesenin aynı yanında kalan 3 ve 5, 4 ve 6 iç; 1 ve 7, 2 ve 8 dış karşı durumlu açılardır. Toplamları 180°.' },
    { scene: 5, start: 70.4, end: 75.8, tr: 'Bir açı 70° ise dördü 70°', en: 'If one angle is 70°, four are 70°',
      note: 'Kesen biraz dönsün ve 2 numaralı açı 70° olsun. Yöndeş ve ters açılar eşit olduğu için 3, 6 ve 7 de 70°.' },
    { scene: 5, start: 76.0, end: 79.8, tr: 'Diğer dördü 180° − 70° = 110°', en: 'The other four are 180° − 70° = 110°',
      note: 'Diğer dört açı ise 180 eksi 70, yani 110°. Bir açıyı bilen, sekizini de bilir.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Yöndeş, iç ters, dış ters eşit; karşı durumlu 180°', en: 'Corresponding and alternate equal; same-side 180°',
      note: 'Aklında kalsın: yöndeş açılar, iç ters açılar ve dış ters açılar eşittir. Karşı durumlu açıların toplamı 180°dir.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Paraleller açıları eşitler!', en: 'Parallels make angles match!',
      note: 'Paralel doğrular ve bir kesen: sekiz açı, yalnızca iki ölçü!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
