import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

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
    content: '<p>Hiring help for your home is a big decision. Here are five key things to consider to ensure you find a reliable and trustworthy professional who fits your family\'s needs.</p><p>1. Clearly Define Your Needs: Before you start searching, make a list of all the tasks you need help with. Is it general cleaning, cooking, laundry, or all of the above? Knowing this will help you filter candidates effectively.</p><p>2. Conduct a Thorough Interview: Don\'t be afraid to ask detailed questions about their experience, work style, and expectations. This is your chance to gauge their personality and professionalism.</p><p>3. Always Check References: Speaking to a previous employer can give you invaluable insight into a candidate\'s reliability, honesty, and quality of work.</p><p>4. Prioritize Verified Professionals: Use a platform like HelpHive that performs background and ID checks. This adds a crucial layer of security and peace of mind for your family.</p><p>5. Set Clear Expectations from Day One: Once you hire someone, have a clear conversation about their duties, work hours, salary, and any house rules. This prevents misunderstandings down the line.</p>',
    author: 'Jane Doe',
    date: 'October 15, 2025',
    imageUrl: 'https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    slug: 'safety-and-trust',
    title: 'How HelpHive Ensures Safety and Trust',
    content: '<p>Your family\'s safety is our top priority. Learn about our rigorous verification process, including ID checks and police verification, that every worker on our platform undergoes.</p><p>Our multi-step verification includes: 1) Government ID Verification to confirm their identity. 2) Police Verification Certificate review to check for any criminal history. 3) Address verification to ensure we know where our professionals reside.</p><p>This comprehensive process is designed to build a community of trust and reliability, so you can hire with confidence.</p>',
    author: 'John Smith',
    date: 'October 10, 2025',
    imageUrl: 'https://images.pexels.com/photos/7551673/pexels-photo-7551673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
];

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = placeholderPosts.find(p => p.slug === slug);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="bg-[var(--color-bg)] text-center py-20">
        <h1 className="text-2xl font-bold">Post not found!</h1>
        <Link to="/blog" className="mt-4 inline-block text-[var(--color-primary)]">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-[var(--color-bg)]"
      initial="initial" animate="in" exit="out"
      variants={pageVariants} transition={pageTransition}
    >
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Link to="/blog" className="text-sm font-semibold text-[var(--color-primary)]">← Back to all articles</Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[var(--color-text-strong)] sm:text-5xl">{post.title}</h1>
          <p className="mt-6 text-[var(--color-text-muted)]">{post.author} • {post.date}</p>
        </div>
        <img src={post.imageUrl} alt={post.title} className="w-full h-96 object-cover rounded-lg shadow-lg" />
        <div 
          className="prose prose-lg dark:prose-invert mx-auto text-[var(--color-text)] mt-12 space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </main>
      <Footer />
    </motion.div>
  );
};

export default BlogPostPage;