from collections import defaultdict, deque


class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = defaultdict(list)
        for course, prereq in prerequisites:
            graph[prereq].append(course)

        indegrees = [0] * numCourses
        for prereq, _ in prerequisites:
            indegrees[prereq] += 1

        queue = deque()
        for course in range(numCourses):
            if indegrees[course] == 0:
                queue.append(course)

        while queue:
            course = queue.popleft()
            for prereq in graph[course]:
                indegrees[prereq] -= 1
                if indegrees[prereq] == 0:
                    queue.append(prereq)

        return all(indegree == 0 for indegree in indegrees)
