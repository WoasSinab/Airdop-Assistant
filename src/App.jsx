import { useState } from 'react';
// import './App.css'; // این خط در main.jsx ایمپورت شده، نیازی نیست اینجا دوباره باشد مگر اینکه فقط برای این کامپوننت باشد

function App() {
  const [airdropLink, setAirdropLink] = useState('');
  // از null برای نمایش حالت اولیه، و از یک آبجکت برای نمایش نتایج استفاده می‌کنیم.
  // فعلاً analysisResult رو null می‌ذاریم تا بعداً با بک‌اند پر شه.
  // یا می‌تونیم از یک mock data برای تست UI استفاده کنیم.
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // برای نشان دادن وضعیت لودینگ
  const [error, setError] = useState(null); // برای نمایش ارورها

  // Mock data برای تست ظاهر UI
  const mockAnalysisResult = {
    summary: "این یک ایردراپ تخیلی برای پروژه TestCoin است که با هدف افزایش آگاهی و توزیع توکن بین کاربران اولیه طراحی شده. شرکت‌کنندگان با انجام تسک‌های ساده، واجد شرایط دریافت توکن TEST می‌شوند.",
    tasks: [
      "فالو کردن صفحه توییتر @TestCoinOfficial",
      "ریتوییت کردن پست پین شده ایردراپ و تگ کردن 3 نفر از دوستان",
      "جوین شدن در کانال دیسکورد TestCoin",
      "پر کردن فرم ثبت نام ایردراپ با آدرس ولت ERC-20"
    ],
    official_links: [
      { name: "Website", url: "https://www.testcoin.io" },
      { name: "Twitter", url: "https://twitter.com/TestCoinOfficial" },
      { name: "Discord", url: "https://discord.gg/testcoin" }
    ],
    warnings: [
      "وایت‌پیپر پروژه هنوز منتشر نشده است.",
      "تیم توسعه‌دهنده به طور کامل ناشناس هستند."
    ]
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // پاک کردن نتایج قبلی برای هر تحلیل جدید

    // **این بخش در آینده با فراخوانی بک‌اند واقعی جایگزین می‌شود.**
    // فعلاً از setTimeout برای شبیه‌سازی یک درخواست API و نمایش mock data استفاده می‌کنیم.
    setTimeout(() => {
      // شبیه‌سازی موفقیت یا خطا
      if (airdropLink.includes('error')) { // یک شرط ساده برای شبیه‌سازی خطا
        setError('خطای شبیه‌سازی: مشکلی در تحلیل لینک رخ داد.');
        setAnalysisResult(null);
      } else {
        setAnalysisResult(mockAnalysisResult); // نمایش داده‌های نمونه
      }
      setIsLoading(false);
    }, 2000); // 2 ثانیه تاخیر برای شبیه‌سازی لودینگ
  };

  return (
    <div className="App">
      <h1>دستیار هوشمند ایردراپ</h1>
      <p>لینک ایردراپ (توییتر، دیسکورد، وب‌سایت) را وارد کنید تا تحلیل شود.</p>

      <div className="input-section">
        <input
          type="text"
          value={airdropLink}
          onChange={(e) => setAirdropLink(e.target.value)}
          placeholder="لینک ایردراپ را اینجا وارد کنید..."
          disabled={isLoading}
        />
        <button onClick={handleAnalyze} disabled={isLoading || !airdropLink.trim()}>
          {isLoading ? 'در حال تحلیل...' : 'تحلیل ایردراپ'}
        </button>
      </div>

      {error && <p className="error-message">خطا: {error}</p>}

      {isLoading && !error && <p className="loading-message">در حال تحلیل ایردراپ... لطفا صبر کنید.</p>}

      {analysisResult && (
        <div className="analysis-results">
          <h2>نتایج تحلیل:</h2>

          {analysisResult.summary && (
            <div className="result-section">
              <h3>خلاصه ایردراپ:</h3>
              <p>{analysisResult.summary}</p>
            </div>
          )}

          {analysisResult.tasks && analysisResult.tasks.length > 0 && (
            <div className="result-section">
              <h3>تسک‌های مورد نیاز:</h3>
              <ul>
                {analysisResult.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.official_links && analysisResult.official_links.length > 0 && (
            <div className="result-section">
              <h3>لینک‌های رسمی:</h3>
              <ul>
                {analysisResult.official_links.map((linkObj, index) => (
                  <li key={index}>
                    <a href={linkObj.url} target="_blank" rel="noopener noreferrer">
                      {linkObj.name || linkObj.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysisResult.warnings && analysisResult.warnings.length > 0 && (
            <div className="result-section warning-message">
              <h3>هشدارهای احتمالی:</h3>
              <ul>
                {analysisResult.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;