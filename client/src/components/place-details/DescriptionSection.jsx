const DescriptionSection = ({ data }) => {
  const { Place_Desc, City_Desc } = data;
  return (
    <section
      id="place-descr-intro"
      className="relative lg:col-span-3 col-span-4 xl:px-[100px] xl:py-[70px] pt-0 p-[60px] text-right overflow-hidden"
    >
      <h1 className="text-6xl font-extrabold" data-aos="fade-up">
        About the <span className="text-indigo-500">place</span>
      </h1>
      <p
        className="font-medium text-lg text-gray-600 leading-6 mt-6 mb-12 xl:pl-20 pl-0"
        data-aos="fade-in"
      >
        {Place_Desc ||
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatum, id laudantium facere omnis quaerat fugit nulla nisi repudiandae reprehenderit dolorum commodi recusandae esse tempora vero. Sunt voluptatem tempora doloremque unde? Dolorum praesentium officia quis a minima magni est vero reiciendis totam, dignissimos temporibus explicabo neque perferendis eos? Officiis odit sit non quod, quam iusto quas animi molestiae dolorum mollitia itaque?"}
        <br />
        {City_Desc ||
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam sunt commodi eum architecto, illo est ipsam odit voluptate deleniti molestias laboriosam aliquam laborum eaque rerum atque cupiditate. Officia, reiciendis vitae."}
      </p>
    </section>
  );
};

export default DescriptionSection;
