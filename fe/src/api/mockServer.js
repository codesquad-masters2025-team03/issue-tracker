import mockData from '../mock.json';

export const mockServer = {
  post: async (url, data) => {
    if (url.includes('/issues')) {
      const newIssue = {
        issue: {
          issueId: mockData.issues?.length + 1,
          title: data.title,
          content: data.content,
          authorId: 1, // 임시 authorId
          milestoneId: data.milestoneId,
          isOpen: true,
          lastModifiedAt: new Date().toISOString(),
          issueFileUrl: data.issueFileUrl || null,
        },
        assignees: data.assigneeIds
          .map((id) => {
            const user = mockData.users.find((u) => u.id === id);
            return user
              ? {
                  id: user.id,
                  nickName: user.nickName,
                  profileImageUrl: `https://dummy.local/profile/${user.nickName}.png`,
                }
              : null;
          })
          .filter(Boolean),
        labels: data.labelIds
          .map((id) => {
            const label = mockData.labels.find((l) => l.id === id);
            return label
              ? {
                  labelId: label.id,
                  name: label.name,
                  color: label.color,
                }
              : null;
          })
          .filter(Boolean),
        milestone: data.milestoneId
          ? {
              ...mockData.milestones.find((m) => m.id === data.milestoneId),
              milestoneId: data.milestoneId,
              processingRate: 0,
            }
          : null,
        comments: [],
      };

      return {
        status: 201,
        data: newIssue,
      };
    }

    throw new Error('Not found');
  },
};
