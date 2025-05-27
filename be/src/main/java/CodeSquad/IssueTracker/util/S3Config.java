package CodeSquad.IssueTracker.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;


@Configuration
@Profile("dev")
public class S3Config {

    @Value("${cloud.aws.region.static}")
    private String region;


    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .build(); // DefaultCredentialsProvider가 IAM 역할 사용
    }
}

