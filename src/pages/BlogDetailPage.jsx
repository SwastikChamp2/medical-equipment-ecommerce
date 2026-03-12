import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Share2, MessageCircle, ChevronRight, BookOpen } from 'lucide-react';
import { getBlogById, getBlogs } from '../services/blogService';
import Button from '../components/Button';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      window.scrollTo(0, 0);
      const data = await getBlogById(id);
      if (!data) {
        navigate('/blog');
        return;
      }
      setBlog(data);
      
      const allBlogs = await getBlogs();
      setRecentBlogs(allBlogs.filter(b => b.id !== id).slice(0, 3));
      setLoading(false);
    };
    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Article Header */}
      <div className="bg-white border-b border-border">
        <div className="container-main max-w-4xl py-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary text-sm font-bold mb-8 hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
            <span className="bg-primary/10 px-3 py-1 rounded-full">{blog.category}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-text-primary leading-tight mb-8">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{blog.author}</p>
                <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {blog.readTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <Share2 size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main max-w-4xl mt-12">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="w-full max-h-[500px] object-cover"
          />
          <div className="p-8 md:p-12 lg:p-16">
            <article className="prose prose-blue max-w-none text-text-secondary leading-loose space-y-6">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
            </article>

            {/* Tags/Keywords */}
            <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2">
              <span className="text-sm font-bold text-text-primary mr-2 self-center">Tags:</span>
              {['Health', 'Medical', 'Care', 'Wellness'].map(tag => (
                <span key={tag} className="bg-gray-100 text-text-secondary px-4 py-1.5 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation between posts */}
        <div className="mt-12 py-12 border-y border-border flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="max-w-[250px] text-center sm:text-left">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Previous Post</p>
            <h4 className="text-sm font-bold text-text-primary line-clamp-1">Understanding CGM Sensors</h4>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block"></div>
          <div className="max-w-[250px] text-center sm:text-right">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Next Post</p>
            <h4 className="text-sm font-bold text-text-primary line-clamp-1">Respiratory Health Guide</h4>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-text-primary">Related Articles</h2>
            <Link to="/blog" className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold text-primary uppercase mb-2">{post.category}</p>
                  <h3 className="text-md font-bold text-text-primary line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10 text-center relative overflow-hidden">
          <BookOpen className="absolute -right-8 -bottom-8 text-primary/5" size={160} />
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-4">Want more health tips?</h2>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            Subscribe to our newsletter and get the latest updates on medical equipment, wellness advice, and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-3 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <Button variant="primary" size="lg">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
