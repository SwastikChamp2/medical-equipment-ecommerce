import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import Button from './Button';

const readingMaterials = [
  {
    id: '1',
    title: 'Diabetes Management Guide 2024',
    description: 'A comprehensive guide on managing blood sugar levels, diet, and lifestyle for Type 1 and Type 2 diabetes.',
    url: 'https://www.who.int/docs/default-source/diabetes-management/diabetes-management-guide.pdf', // Example public PDF
    category: 'Educational',
    fileSize: '2.4 MB'
  },
  {
    id: '2',
    title: 'CPAP Therapy Handbook',
    description: 'Everything you need to know about setting up, cleaning, and maintaining your CPAP machine for better sleep.',
    url: 'https://www.resmed.com/us/en/dam/documents/products/machine/airsense-10-series/user-guide/airsense-10-autoset-for-her_user-guide_amer_eng.pdf', // Example public PDF
    category: 'User Manual',
    fileSize: '1.8 MB'
  },
  {
    id: '3',
    title: 'Home Vitals Monitoring 101',
    description: 'Learn how to accurately measure your blood pressure and heart rate from the comfort of your home.',
    url: 'https://www.heart.org/-/media/files/health-topics/high-blood-pressure/how-to-measure-blood-pressure-letter-size-pdf.pdf', // Example public PDF
    category: 'Health Guide',
    fileSize: '1.2 MB'
  },
  {
    id: '4',
    title: 'Healthy Heart Recipes',
    description: 'A collection of heart-healthy recipes designed by nutritionists to keep your cardiovascular system strong.',
    url: 'https://www.nhlbi.nih.gov/files/docs/public/heart/healthy_heart_recipes.pdf', // Example public PDF
    category: 'Nutrition',
    fileSize: '3.5 MB'
  }
];

const ReadingMaterials = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">Reading Materials</h2>
            <p className="text-text-secondary">Downloadable guides and resources for your health journey</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary px-3 py-1 bg-white border border-border rounded-full">
              PDF Format
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {readingMaterials.map((material) => (
            <div
              key={material.id}
              className="group bg-white rounded-2xl border border-border p-6 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <FileText size={24} className="text-primary group-hover:text-white" />
              </div>

              <div className="inline-block self-start px-2 py-0.5 rounded bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                {material.category}
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight group-hover:text-primary transition-colors">
                {material.title}
              </h3>

              <p className="text-sm text-text-secondary mb-6 flex-grow line-clamp-3">
                {material.description}
              </p>

              <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                <span className="text-xs text-gray-400 font-medium">{material.fileSize}</span>
                <a
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors group/link"
                >
                  Download PDF
                  <ExternalLink size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadingMaterials;
