package CodeSquad.IssueTracker.label;

import CodeSquad.IssueTracker.issueLabel.IssueLabelService;
import CodeSquad.IssueTracker.label.dto.LabelUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;
    private final IssueLabelService labelService;

    public Label save(Label label) {
        return labelRepository.save(label);
    }

    public List<Label> findAll() {
        return labelRepository.findAll();
    }

    public List<Label> findByIssueId(Long issueId) {
        return labelRepository.findByIssueId(issueId);
    }

    public void update(Long labelId, LabelUpdateDto updateParam) {
        labelRepository.update(labelId, updateParam);
    }

    @Transactional
    public void deleteById(Long labelId) {
        labelService.deleteByLabelId(labelId);
        labelRepository.deleteById(labelId);
    }
}
