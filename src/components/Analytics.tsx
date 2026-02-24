import Script from "next/script";

type AnalyticsProps = {
  gaId?: string;
};

export function Analytics({ gaId }: AnalyticsProps) {
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}gtag("js", new Date());gtag("config","${gaId}");`}
      </Script>
    </>
  );
}
