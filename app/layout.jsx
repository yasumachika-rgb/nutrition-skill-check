import "./globals.css";

export const metadata = {
  title: "栄養指導スキルチェック",
  description:
    "全25問・約5分で、あなたの栄養指導スキルを5つの観点から診断します。強みと弱点を見える化し、結果をPDFでダウンロードできます。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
