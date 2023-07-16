class NewsCard {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final String? sourceUrl;
  final String? author;
  final String? sourceName;
  final String? mainTag;
  final List<String?>? secondaryTags;
  final String? locality;
  final DateTime? createdAt;
  final String? sinhalaDescription;
  final String? sinhalaTitle;
  final int postIndex;
  final String? typeOfPost;

  NewsCard({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    this.sourceUrl,
    this.author,
    this.sourceName,
    this.mainTag,
    this.secondaryTags,
    this.locality,
    this.createdAt,
    this.sinhalaDescription,
    this.sinhalaTitle,
    required this.postIndex,
    this.typeOfPost,
  });
}

extension NewsCardListExtensions on List<NewsCard> {
  List<int> getPostIndexAfter(int x) {
    if (x < 0 || x >= length - 1) {
      throw ArgumentError('Index out of bounds');
    }

    List<int> postIndices = [];
    for (int i = x + 1; i < length; i++) {
      postIndices.add(this[i].postIndex);
    }
    return postIndices;
  }
}
