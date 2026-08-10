import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const placeholderPosts = [
  {
    slug: 'finding-the-right-maid',
    title: '5 Tips for Finding the Right Maid for Your Family',
    excerpt: 'Hiring help for your home is a big decision. Here are five key things to consider to ensure you find a reliable and trustworthy professional who fits your family\'s needs.',
    author: 'Jane Doe',
    date: 'October 15, 2025',
    imageUrl: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    slug: 'safety-and-trust',
    title: 'How HelpHive Ensures Safety and Trust',
    excerpt: 'Your family\'s safety is our top priority. Learn about our rigorous verification process, including ID checks and police verification, that every worker on our platform undergoes.',
    author: 'John Smith',
    date: 'October 10, 2025',
    imageUrl: 'https://images.pexels.com/photos/7551673/pexels-photo-7551673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
];

const BlogPage = () => {
  return (
    <motion.div
      className="bg-[var(--color-bg)]"
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
    >
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <PageHeader 
          title="From the HelpHive Blog"
          subtitle="Insights, tips, and stories about building happier, more efficient homes."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {placeholderPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="overflow-hidden rounded-lg">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-semibold text-[var(--color-text-strong)] group-hover:text-[var(--color-primary)] transition-colors">{post.title}</h3>
                  <p className="mt-2 text-[var(--color-text-muted)] text-sm">{post.author} • {post.date}</p>
                  <p className="mt-3 text-[var(--color-text)]">{post.excerpt}</p>
                  <span className="mt-4 inline-block font-semibold text-[var(--color-primary)]">Read more →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default BlogPage;