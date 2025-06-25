-- Seed data for AptosCred platform

-- Insert skill categories
INSERT INTO skill_categories (name, description) VALUES
('Programming Languages', 'Core programming languages and syntax'),
('Web Development', 'Frontend and backend web technologies'),
('Mobile Development', 'iOS, Android, and cross-platform mobile development'),
('Data Science', 'Data analysis, machine learning, and statistics'),
('DevOps', 'Infrastructure, deployment, and operations'),
('Design', 'UI/UX design and visual design'),
('Blockchain', 'Cryptocurrency, smart contracts, and DeFi'),
('Marketing', 'Digital marketing and growth strategies'),
('Project Management', 'Agile, Scrum, and project coordination');

-- Insert skills
INSERT INTO skills (category_id, name, description) VALUES
-- Programming Languages
((SELECT id FROM skill_categories WHERE name = 'Programming Languages'), 'JavaScript', 'Modern JavaScript and ES6+ features'),
((SELECT id FROM skill_categories WHERE name = 'Programming Languages'), 'Python', 'Python programming and ecosystem'),
((SELECT id FROM skill_categories WHERE name = 'Programming Languages'), 'Java', 'Java programming and JVM ecosystem'),
((SELECT id FROM skill_categories WHERE name = 'Programming Languages'), 'TypeScript', 'TypeScript for type-safe JavaScript'),
((SELECT id FROM skill_categories WHERE name = 'Programming Languages'), 'Go', 'Go programming language'),
((SELECT id FROM skill_categories WHERE name = 'Programming Languages'), 'Rust', 'Systems programming with Rust'),

-- Web Development
((SELECT id FROM skill_categories WHERE name = 'Web Development'), 'React', 'React.js library and ecosystem'),
((SELECT id FROM skill_categories WHERE name = 'Web Development'), 'Next.js', 'Next.js React framework'),
((SELECT id FROM skill_categories WHERE name = 'Web Development'), 'Node.js', 'Server-side JavaScript with Node.js'),
((SELECT id FROM skill_categories WHERE name = 'Web Development'), 'Vue.js', 'Vue.js progressive framework'),
((SELECT id FROM skill_categories WHERE name = 'Web Development'), 'Angular', 'Angular framework'),
((SELECT id FROM skill_categories WHERE name = 'Web Development'), 'Express.js', 'Express.js web framework'),

-- Mobile Development
((SELECT id FROM skill_categories WHERE name = 'Mobile Development'), 'React Native', 'Cross-platform mobile development'),
((SELECT id FROM skill_categories WHERE name = 'Mobile Development'), 'Flutter', 'Flutter mobile development'),
((SELECT id FROM skill_categories WHERE name = 'Mobile Development'), 'iOS Development', 'Native iOS development'),
((SELECT id FROM skill_categories WHERE name = 'Mobile Development'), 'Android Development', 'Native Android development'),

-- Data Science
((SELECT id FROM skill_categories WHERE name = 'Data Science'), 'Machine Learning', 'ML algorithms and models'),
((SELECT id FROM skill_categories WHERE name = 'Data Science'), 'Data Analysis', 'Statistical analysis and insights'),
((SELECT id FROM skill_categories WHERE name = 'Data Science'), 'SQL', 'Database querying and management'),
((SELECT id FROM skill_categories WHERE name = 'Data Science'), 'TensorFlow', 'TensorFlow machine learning'),
((SELECT id FROM skill_categories WHERE name = 'Data Science'), 'PyTorch', 'PyTorch deep learning'),

-- DevOps
((SELECT id FROM skill_categories WHERE name = 'DevOps'), 'Docker', 'Containerization with Docker'),
((SELECT id FROM skill_categories WHERE name = 'DevOps'), 'Kubernetes', 'Container orchestration'),
((SELECT id FROM skill_categories WHERE name = 'DevOps'), 'AWS', 'Amazon Web Services'),
((SELECT id FROM skill_categories WHERE name = 'DevOps'), 'CI/CD', 'Continuous integration and deployment'),

-- Design
((SELECT id FROM skill_categories WHERE name = 'Design'), 'UI/UX Design', 'User interface and experience design'),
((SELECT id FROM skill_categories WHERE name = 'Design'), 'Figma', 'Figma design tool'),
((SELECT id FROM skill_categories WHERE name = 'Design'), 'Adobe Creative Suite', 'Adobe design tools'),

-- Blockchain
((SELECT id FROM skill_categories WHERE name = 'Blockchain'), 'Solidity', 'Ethereum smart contract development'),
((SELECT id FROM skill_categories WHERE name = 'Blockchain'), 'Move', 'Aptos Move programming language'),
((SELECT id FROM skill_categories WHERE name = 'Blockchain'), 'Web3', 'Web3 development and integration'),
((SELECT id FROM skill_categories WHERE name = 'Blockchain'), 'DeFi', 'Decentralized finance protocols'),

-- Marketing
((SELECT id FROM skill_categories WHERE name = 'Marketing'), 'Digital Marketing', 'Online marketing strategies'),
((SELECT id FROM skill_categories WHERE name = 'Marketing'), 'SEO', 'Search engine optimization'),
((SELECT id FROM skill_categories WHERE name = 'Marketing'), 'Content Marketing', 'Content strategy and creation'),

-- Project Management
((SELECT id FROM skill_categories WHERE name = 'Project Management'), 'Agile', 'Agile project management'),
((SELECT id FROM skill_categories WHERE name = 'Project Management'), 'Scrum', 'Scrum framework'),
((SELECT id FROM skill_categories WHERE name = 'Project Management'), 'Product Management', 'Product strategy and roadmap');

-- Insert job categories
INSERT INTO job_categories (name, description) VALUES
('Development', 'Software development and programming jobs'),
('Design', 'UI/UX and graphic design positions'),
('Data Science', 'Data analysis and machine learning roles'),
('Marketing', 'Digital marketing and growth positions'),
('Project Management', 'Project and product management roles'),
('Blockchain', 'Cryptocurrency and Web3 development'),
('DevOps', 'Infrastructure and operations roles'),
('Consulting', 'Technical consulting and advisory');

-- Insert sample users (for testing)
INSERT INTO users (wallet_address, username, full_name, bio, reputation_score) VALUES
('0x1234567890abcdef1234567890abcdef12345678', 'alice_dev', 'Alice Johnson', 'Full-stack developer with 5+ years experience', 850),
('0xabcdef1234567890abcdef1234567890abcdef12', 'bob_designer', 'Bob Smith', 'UI/UX designer passionate about user experience', 720),
('0x9876543210fedcba9876543210fedcba98765432', 'carol_data', 'Carol Davis', 'Data scientist specializing in ML and AI', 680),
('0xfedcba9876543210fedcba9876543210fedcba98', 'dave_blockchain', 'Dave Wilson', 'Blockchain developer and smart contract auditor', 920);
