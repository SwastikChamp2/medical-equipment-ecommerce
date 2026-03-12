const BLOGS = [
  {
    id: 'managing-diabetes-at-home',
    title: '5 Essential Tips for Managing Diabetes at Home',
    excerpt: 'Consistency is key when it comes to blood sugar management. Learn the daily habits that can make a major difference.',
    content: `
      <h2>1. Monitor Your Blood Sugar Regularly</h2>
      <p>Using a Continuous Glucose Monitor (CGM) or a reliable glucometer is the first step in understanding how your body reacts to different foods and activities. Regular testing helps you identify patterns and make informed decisions about your health.</p>
      
      <h2>2. Focus on a Balanced Diet</h2>
      <p>Incorporate fiber-rich foods, lean proteins, and healthy fats into your meals. Avoiding processed sugars and refined carbohydrates can help prevent sudden spikes in blood glucose levels. Portion control is equally important.</p>
      
      <h2>3. Stay Physically Active</h2>
      <p>Exercise helps your muscles use blood sugar for energy and improves insulin sensitivity. Aim for at least 30 minutes of moderate activity, such as brisk walking, five days a week.</p>
      
      <h2>4. Manage Stress Levels</h2>
      <p>Stress triggers the release of hormones that can raise blood sugar. Practices like yoga, meditation, and deep breathing exercises can help keep your stress in check and your glucose levels stable.</p>
      
      <h2>5. Keep Your Supplier Reliable</h2>
      <p>Running out of testing strips or sensors can cause unnecessary stress. Using a subscription service ensures you always have the supplies you need, delivered right to your door.</p>
    `,
    image: 'https://images.unsplash.com/photo-1505751172107-573220ad703a?auto=format&fit=crop&q=80&w=1000',
    category: 'Education',
    author: 'Dr. Sarah Smith',
    date: 'March 10, 2024',
    readTime: '5 min read'
  },
  {
    id: 'understanding-cgm-sensors',
    title: 'Understanding CGM Sensors: The Future of Monitoring',
    excerpt: 'Continuous Glucose Monitors have revolutionized how we track vitals. Find out how they work and why you might need one.',
    content: `
      <p>Continuous Glucose Monitoring (CGM) systems provide real-time updates on your glucose levels throughout the day and night. Unlike traditional finger-stick tests, a CGM uses a tiny sensor inserted under the skin to measure glucose in the interstitial fluid.</p>
      
      <h2>How It Works</h2>
      <p>The sensor sends data to a transmitter, which then beams the information to a smartphone or a dedicated receiver. This allows you to see your glucose trends and receive alerts if your levels are too high or too low.</p>
      
      <h2>Benefits of CGM</h2>
      <ul>
        <li>Fewer finger sticks</li>
        <li>Real-time data and alerts</li>
        <li>Detailed insights into glucose patterns</li>
        <li>Improved peace of mind for caregivers</li>
      </ul>
      
      <p>Whether you have Type 1 or Type 2 diabetes, a CGM can provide the detailed information needed to manage your condition more effectively.</p>
    `,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=1000',
    category: 'Technology',
    author: 'Dr. John Doe',
    date: 'March 8, 2024',
    readTime: '4 min read'
  },
  {
    id: 'respiratory-health-guide',
    title: 'A Guide to Better Respiratory Health',
    excerpt: 'From CPAP machines to simple breathing exercises, discover how to improve your lung function and sleep quality.',
    content: `
      <p>Good respiratory health is vital for overall well-being. If you struggle with sleep apnea or chronic respiratory issues, modern medical technology offers several solutions to help you breathe easier.</p>
      
      <h2>The Role of CPAP Therapy</h2>
      <p>Continuous Positive Airway Pressure (CPAP) therapy is the gold standard for treating obstructive sleep apnea. It keeps your airways open during sleep, reducing snoring and improving the quality of your rest.</p>
      
      <h2>Maintenance is Essential</h2>
      <p>To ensure your respiratory equipment works effectively, it's crucial to change filters regularly and clean your mask daily. This prevents the buildup of bacteria and ensures you're breathing clean, filtered air.</p>
      
      <p>By combining technology with simple lifestyle changes like avoiding pollutants and practicing deep breathing, you can significantly improve your respiratory health.</p>
    `,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000',
    category: 'Wellness',
    author: 'Dr. Emily Brown',
    date: 'March 5, 2024',
    readTime: '6 min read'
  }
];

export async function getBlogs() {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(BLOGS), 500);
  });
}

export async function getBlogById(id) {
  // Simulate API delay
  return new Promise((resolve) => {
    const blog = BLOGS.find(b => b.id === id);
    setTimeout(() => resolve(blog), 300);
  });
}
