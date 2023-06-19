class NewsCard {
  final String? id;
  final String? title;
  final String? description;
  final String? imageUrl;
  final String? sourceUrl;
  final String? author;
  final String? sourceName;
  final String? mainTag;
  //final List<String?>? secondaryTags;
  final String? locality;
  final String? createdAt;

  NewsCard(
      {required this.id,
      required this.title,
      required this.description,
      this.imageUrl,
      this.sourceUrl,
      this.author,
      this.sourceName,
      this.mainTag,
      //this.secondaryTags,
      this.locality,
      this.createdAt});
}
