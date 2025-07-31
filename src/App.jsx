import { useState } from 'react';

function App() {
  const [airdropLink, setAirdropLink] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null); // پاک کردن نتایج قبلی برای هر تحلیل جدید

    try {
      // آدرس IP عمومی سرور مجازی شما (77.90.51.227)
      const backendUrl = `http://77.90.51.227:5000/analyze`;

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: airdropLink }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در تحلیل ایردراپ رخ داد.');
      }

      const data = await response.json();
      // بررسی می‌کنیم که آیا داده‌ها طبق انتظار هستند (فیلدهای جدید اضافه شده‌اند)
      if (!data.summary || !data.tasks || !data.official_links || 
          data.worth_score === undefined || !data.worth_reasoning ||
          !data.project_goals || !data.full_description || !data.current_progress ||
          !data.how_to_get_points || !data.project_type || !data.start_date || !data.galxe_info) { // اضافه کردن galxe_info
        throw new Error('پاسخ از سرور نامعتبر است یا فرمت درستی ندارد. (برخی فیلدها گم شده‌اند)');
      }
      setAnalysisResult(data);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // تابع برای تعیین کلاس رنگ امتیازدهی
  const getScoreColorClass = (score) => {
    if (score >= 8) return 'score-high';
    if (score >= 5) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="App">
      <h1 className="neon-text">دستیار هوشمند ایردراپ</h1> {/* اضافه کردن کلاس برای افکت نئون */}
      <p className="app-description">لینک ایردراپ (توییتر، دیسکورد، وب‌سایت) را وارد کنید تا تحلیل شود.</p>

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
        <div className="analysis-results-grid"> {/* Grid container */}
          
          {/* بخش امتیازدهی */}
          {analysisResult.worth_score !== undefined && analysisResult.worth_reasoning && (
            <div className={`result-card worth-score-section ${getScoreColorClass(analysisResult.worth_score)}`}>
              <h2>امتیاز ارزش ایردراپ:</h2>
              <div className="score-display">
                <span className="score-number">{analysisResult.worth_score}</span>
                <span className="score-total">/10</span>
              </div>
              <p className="worth-reasoning">{analysisResult.worth_reasoning}</p>
            </div>
          )}

          {/* خلاصه ایردراپ */}
          {analysisResult.summary && (
            <div className="result-card summary-section">
              <h2>خلاصه ایردراپ:</h2>
              <p>{analysisResult.summary}</p>
            </div>
          )}

          {/* اهداف پروژه */}
          {analysisResult.project_goals && (
            <div className="result-card project-goals-section">
              <h2>اهداف پروژه:</h2>
              <p>{analysisResult.project_goals}</p>
            </div>
          )}

          {/* نوع پروژه */}
          {analysisResult.project_type && (
            <div className="result-card project-type-section">
              <h2>نوع پروژه:</h2>
              <p>{analysisResult.project_type}</p>
            </div>
          )}

          {/* شرح حال کامل پروژه */}
          {analysisResult.full_description && (
            <div className="result-card full-description-section">
              <h2>شرح حال کامل پروژه:</h2>
              <p>{analysisResult.full_description}</p>
            </div>
          )}

          {/* وضعیت فعلی پروژه */}
          {analysisResult.current_progress && (
            <div className="result-card current-progress-section">
              <h2>وضعیت فعلی پروژه:</h2>
              <p>{analysisResult.current_progress}</p>
            </div>
          )}

          {/* تسک‌های مورد نیاز */}
          {analysisResult.tasks && analysisResult.tasks.length > 0 && (
            <div className="result-card tasks-section">
              <h2>تسک‌های مورد نیاز:</h2>
              <ul>
                {analysisResult.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          )}

          {/* نحوه امتیازگیری */}
          {analysisResult.how_to_get_points && (
            <div className="result-card how-to-get-points-section">
              <h2>نحوه امتیازگیری:</h2>
              <p>{analysisResult.how_to_get_points}</p>
            </div>
          )}

          {/* تاریخ شروع تسک‌ها */}
          {analysisResult.start_date && (
            <div className="result-card start-date-section">
              <h2>تاریخ شروع تسک‌ها:</h2>
              <p>{analysisResult.start_date}</p>
            </div>
          )}

          {/* اطلاعات Galxe */}
          {analysisResult.galxe_info && (
            <div className="result-card galxe-info-section">
              <h2>اطلاعات Galxe:</h2>
              {analysisResult.galxe_info.campaign_links && analysisResult.galxe_info.campaign_links.length > 0 ? (
                <>
                  <p>لینک‌های کمپین فعال Galxe پیدا شد:</p>
                  <ul>
                    {analysisResult.galxe_info.campaign_links.map((link, index) => (
                      <li key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>هیچ لینک مستقیم Galxe در محتوای پروژه پیدا نشد.</p>
              )}
              {analysisResult.galxe_info.recommendation && (
                <p className="galxe-recommendation">{analysisResult.galxe_info.recommendation}</p>
              )}
            </div>
          )}

          {/* لینک‌های رسمی */}
          {analysisResult.official_links && analysisResult.official_links.length > 0 && (
            <div className="result-card links-section">
              <h2>لینک‌های رسمی:</h2>
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

          {/* هشدارهای احتمالی */}
          {analysisResult.warnings && analysisResult.warnings.length > 0 && (
            <div className="result-card warning-message-card">
              <h2>هشدارهای احتمالی:</h2>
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
