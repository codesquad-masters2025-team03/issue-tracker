DROP TABLE IF EXISTS issue_label;
DROP TABLE IF EXISTS issue_assignee;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS labels;
DROP TABLE IF EXISTS milestones;
DROP TABLE IF EXISTS users;


-- Users
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       login_id VARCHAR(255) NOT NULL,
                       password VARCHAR(255),
                       nick_name VARCHAR(255) NOT NULL,
                       profile_image_url VARCHAR(512)
);

-- Milestones
CREATE TABLE milestones (
                            milestone_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description VARCHAR(255),
                            end_date TIMESTAMP,
                            is_open TINYINT(1) DEFAULT 1,
                            last_modified_at TIMESTAMP,
                            processing_rate BIGINT
);

-- Labels
CREATE TABLE labels (
                        label_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(50) NOT NULL,
                        description VARCHAR(255),
                        color VARCHAR(20),
                        created_at TIMESTAMP
);

-- Issues
CREATE TABLE issues (
                        issue_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        title VARCHAR(255) NOT NULL,
                        content TEXT,
                        author_id BIGINT,
                        milestone_id BIGINT,
                        is_open TINYINT(1) DEFAULT 1,
                        last_modified_at TIMESTAMP,
                        image_url VARCHAR(512),
                        FOREIGN KEY (author_id) REFERENCES users(id),
                        FOREIGN KEY (milestone_id) REFERENCES milestones(milestone_id)
);

-- Issue_Label (N:N)
CREATE TABLE issue_label (
                             issue_label_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                             issue_id BIGINT NOT NULL,
                             label_id BIGINT NOT NULL,
                             last_modified_at TIMESTAMP,
                             FOREIGN KEY (issue_id) REFERENCES issues(issue_id),
                             FOREIGN KEY (label_id) REFERENCES labels(label_id)
);

-- Issue_Assignee (N:N)
CREATE TABLE issue_assignee (
                                issue_assignee_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                issue_id BIGINT NOT NULL,
                                assignee_id BIGINT NOT NULL,
                                last_modified_at TIMESTAMP,
                                FOREIGN KEY (issue_id) REFERENCES issues(issue_id),
                                FOREIGN KEY (assignee_id) REFERENCES users(id)
);

-- Comments
CREATE TABLE comments (
                          comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          issue_id BIGINT NOT NULL,
                          content TEXT,
                          author_id BIGINT,
                          last_modified_at TIMESTAMP,
                          image_url VARCHAR(512),
                          FOREIGN KEY (issue_id) REFERENCES issues(issue_id),
                          FOREIGN KEY (author_id) REFERENCES users(id)
);

