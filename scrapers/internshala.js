import puppeteer from 'puppeteer';
import Job from '../models/Job.js';

const scrapeInternshala = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new', //  run Chrome without a visible window. The 'new' value uses Puppeteer's newer headless mode which is more stable and harder to detect as a bot.
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Chrome normally runs in a security sandbox. On some systems (Linux servers, CI environments) this causes permission errors. This flag disables it. Standard practice for running Puppeteer on servers.
    });

    const urls = [
      'https://internshala.com/internships/computer-science-internship',
      'https://internshala.com/internships/web-development-internship',
      'https://internshala.com/internships/software-development-internship'
    ];

    for (const url of urls) {
      try {
        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
        );
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for job listings to load
        await page.waitForSelector('.individual_internship', { timeout: 5000 }).catch(() => {
          console.log('No internships found with expected selector');
        });

        // Extract job data using page evaluation
        const jobs = await page.evaluate(() => {
          const jobElements = document.querySelectorAll('.individual_internship');
          const jobs = [];

          jobElements.forEach(el => {
            try {
              // Get title from .job-title-href link
              const titleLink = el.querySelector('.job-title-href');
              const title = titleLink?.textContent?.trim() || '';
              
              // Get company name from .company-name
              const companyEl = el.querySelector('.company-name');
              const company = companyEl?.textContent?.trim() || '';
              
              // Get location - it's in the text after Actively hiring badge
              const metaText = el.querySelector('.internship_meta')?.innerText || '';
              const lines = metaText.split('\n').filter(l => l.trim());
              let location = 'India';
              
              // Usually location is 2-3 lines down from company name
              if (lines.length > 3) {
                // "Actively hiring" is usually followed by location
                const activeIdx = lines.findIndex(l => l.includes('Actively'));
                if (activeIdx !== -1 && activeIdx + 1 < lines.length) {
                  location = lines[activeIdx + 1].trim();
                }
              }
              
              // Get apply link from data-href attribute
              const applyLink = el.getAttribute('data-href');
              const fullApplyLink = applyLink ? `https://internshala.com${applyLink}` : null;

              // Get duration
              const durationMatch = metaText.match(/(\d+\s*(?:weeks?|months?|days?))/i);
              const duration = durationMatch ? durationMatch[0] : '';

              if (title && company && fullApplyLink) {
                jobs.push({
                  title,
                  company,
                  location,
                  duration,
                  applyLink: fullApplyLink
                });
              }
            } catch (err) {
              console.error('Error parsing job element:', err.message);
            }
          });

          return jobs;
        });

        // Save to database
        for (const job of jobs) {
          try {
            await Job.create({
              title: job.title,
              company: job.company,
              location: job.location,
              type: 'internship',
              applyLink: job.applyLink,
              source: 'internshala',
              salary: null,
              description: `Duration: ${job.duration}`,
              tags: [],
              postedAt: new Date(),
              isActive: true
            });
          } catch (err) {
            // Duplicate key error = job already exists, skip silently
            if (err.code !== 11000) console.error('Insert error:', err.message);
          }
        }

        console.log(`✓ Scraped ${jobs.length} jobs from: ${url}`);
        await page.close();

      } catch (err) {
        console.error(`✗ Failed to scrape ${url}:`, err.message);
      }
    }

    console.log('✓ Internshala scraping complete');

  } catch (err) {
    console.error('✗ Browser error:', err.message);
  } finally {
    if (browser) await browser.close();
  }
};

export default scrapeInternshala;
